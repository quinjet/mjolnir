var fileManager = require("fs"),
    http = require("http"),
    util = require("util"),
    jsonParser = require('JSON'),
    constants = require("../utils/constants.js"),
    errorMessage = "error occured while calling expertDbSvc",
    data = {
        "names" : null,
        "application": null
    },
    options,
    verticalsEndpoint;
function ExpertDbSvcCommunicator(configFile, logger) {
    var self = this;
    fileManager.readFile(
        configFile,
        function(err, data) {
            if (err != null) {
                throw new Error("Error while reading " + configFile)
            }
            else {
                self.config = jsonParser.parse(data)
                logger.log(
                    "info",
                    "initialized expertDbSvcCommunicator with " + data
                );
            }
        }
    );
    this.getVerticalByName = function(verticalName, callBack) {
        var data = {
            "application": constants.APP_NAME
        }
        verticalsEndpoint = 
            this.getJsonQueryString(this.config.verticalsEndpoint, data);
        options = {
            host: this.config.host,
            port: this.config.port,
            path: verticalsEndpoint,
            method: 'GET'
        };
        this.call(options, callBack);
    }

    this.getSubverticalByName = function(verticalId, subverticalName, callBack) {
        var data = {
            "verticalId": verticalId,
            "application": constants.APP_NAME
        }
        subVerticalsEndpoint = 
            this.getJsonQueryString(this.config.subverticalsEndpoint, data)
        options = {
            host: this.config.host,
            port: this.config.port,
            path: subVerticalsEndpoint,
            method: 'GET'
        };
        this.call(options, callBack);
    }

    this.getVerticalSubverticalIds = function(vertical, subvertical, callBack) {
        var verticalId = -1,
            self = this;
        this.getVerticalByName(
            vertical, 
            function(err, response) {
                if(err == null) {
                    if (response.verticals != undefined &&
                        response.verticals.length > 0) {
                        for (var i =0 ; i < response.verticals.length; i++) {
                            if (response.verticals[i].name == vertical) {
                                verticalId = response.verticals[i].id;
                                break;
                            }
                        }
                        if (verticalId != -1) {
                            processSubVerticalSearch(
                                verticalId, subvertical, function(err, id) {
                                    if (err == null) {
                                        callBack(null, verticalId, id);
                                    }
                                    else {
                                        callBack(err, null, null)
                                    }
                                }
                            )
                        }
                        else {
                            callBack({
                                "error":true,
                                "message": "vertical not found"
                            }, null);
                        }
                    }
                    else {
                        callBack({
                            "error":true,
                            "message": err.message
                        }, null);
                    }
                }
            }
        );
        function processSubVerticalSearch(verticalId, subvertical,callBack) {
            var subverticalId = -1;
            self.getSubverticalByName(
                verticalId, subvertical, function(err, response) {
                    if (response != null && 
                        response.subVerticals != undefined &&
                        response.subVerticals.length > 0) {
                        for (var i =0 ; i < response.subVerticals.length; i++) {
                            if (response.subVerticals[i].name == subvertical) {
                                subverticalId = response.subVerticals[i].id;
                                break;
                            }
                        }
                        logger.log("info", "subverticalId: " + subverticalId);
                        if (subverticalId != -1) {
                            callBack(null, subverticalId);
                        }
                        else {
                            callBack({
                                "error":"true", 
                                "message":"subvertical not found"
                            }, null);
                        }
                    }
                    else {
                        callBack({
                            "error":"true", 
                            "message":"subvertical not found"
                        },null);
                    }
                }
            );
        }
    }
    this.call = function(options, callBack) {
        logger.log("info","http call in progress: " + JSON.stringify(options));
        http.get(
            options,
            function(serviceResponse) {
                var body = "";
                serviceResponse.on('data', function(incomingData) {
                    body += incomingData;
                });
                serviceResponse.on("end", function() {
                    if (serviceResponse.statusCode != 200) {
                        logger.log("error","error occurred" + 
                                   "while calling service" + 
                                   JSON.stringify(body));
                        callBack({
                            "error":true,
                            "message": erroMessage
                        }, null);
                    }
                    else {
                        logger.log(
                            "info",
                            "response from service " + JSON.stringify(body)
                        );
                        callBack(null, jsonParser.parse(body));
                    }
                });
            }
        ).on('error', function(e) {
            logger.log("error",
                "[ERROR] error occurred while communicating with service"
            );
            callBack({"error": true, "message": e.message}, null);
        });
    }
    this.getJsonQueryString = function(url, data) {
        return url + "?jsonQuery=" + JSON.stringify(data);
    }
}
module.exports = ExpertDbSvcCommunicator;
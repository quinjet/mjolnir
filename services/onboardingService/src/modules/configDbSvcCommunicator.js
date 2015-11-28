var fileManager = require("fs"),
    http = require("http"),
    util = require("util"),
    jsonParser = require('JSON'),
    constants = require("../utils/constants.js"),
    errorMessage = "error occured while calling configDbSvc",
    data = {
        "names" : null,
        "application": null
    },
    finalUrl,
    requestUrl;
function ConfigDbSvcCommunicator(configFile, logger) {
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
                    "initialized configDbSvcCommunicator with " + data
                );
            }
        }
    );
    this.getClientsByClientNames = function(clientNames, callBack) {
        
        if(! clientNames instanceof Array) {
            callBack({"error": true, "message" : "input should be array"}, null);
        }
        else {
            for (var i = 0; i < clientNames.length; i++) {
                clientNames[i] = encodeURIComponent(clientNames[i]);
            }
            data["names"] = clientNames
            data["application"] = constants.APP_NAME
            finalUrl = this.config.baseUrl + this.config.clientEndpoint
            requestUrl = 
                this.getJsonQueryString(finalUrl, data);
            logger.log(
                "info","Requesting url for configDbSvc - " + requestUrl
            );
            this.call(requestUrl, callBack);
        }
    }
    this.getVerticalSubverticalByClientId = function(clientId, callBack) {
        data["clientId"] = clientId;
        data["application"] = constants.APP_NAME;
        finalUrl = this.config.baseUrl + this.config.clientSubverticalEndpoint;
        requestUrl = this.getJsonQueryString(finalUrl, data);
        logger.log(
            "info" ,
            "Requesting url :" + requestUrl
        );
        this.call(requestUrl, callBack);
    }
    this.getJsonQueryString = function(url, data) {
        return url + "?jsonQuery=" + JSON.stringify(data);
    }
    this.call = function(requestUrl, callBack) {
        http.get(
            requestUrl,
            function(configDbResponse) {
                var body = "";
                configDbResponse.on('data', function(incomingData) {
                    body += incomingData;
                });
                configDbResponse.on("end", function() {
                    if (configDbResponse.statusCode != 200) {
                        util.error("[ERROR] error occurred while" + 
                                   "calling configDbSvc " + 
                                   JSON.stringify(body));
                        callBack({
                            "error":true,
                            "message": errorMessage
                        }, null);
                    }
                    else {
                        logger.log(
                            "info",
                            "response from configDbSvc " + 
                            JSON.stringify(body)
                        );
                        callBack(null, jsonParser.parse(body));
                    }
                });
            }
        ).on('error', function(e) {
              util.error("[ERROR]" + errorMessage);
              callBack({"error": true, "message": e.message}, null);
        });
    }
}
module.exports = ConfigDbSvcCommunicator;
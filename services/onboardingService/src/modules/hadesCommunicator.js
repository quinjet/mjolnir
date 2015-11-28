var fileManager = require("fs"),
    http = require("http"),
    util = require("util"),
    jsonParser = require('JSON'),
    constants = require("../utils/constants.js"),
    erroMessage = "error occurred while calling hades",
    getByEmailRequest = 
        "com.sokrati.hadesObjects.aclActions.getUsers.GetUserByEmailRequest"
function HadesCommunicator(configFile, logger) {
    var self = this;
    fileManager.readFile(
        configFile,
        function(err, data) {
            if (err != null) 
            {
                throw new Error("Error while reading " + configFile)
            }
            else 
            {
                self.config = jsonParser.parse(data);
                logger.log(
                    "info",
                    "[INFO] initialized hadesCommunicator with config  " + data
                );;
            }
        }
    );
    this.getUserByEmailId = function(emailId, callBack) {
        var requestObj = {
            "@class": getByEmailRequest,
            "email": emailId,
            "application": constants.APP_NAME
        }
        var usersPath = 
            this.getJsonQueryString(self.config.usersEndpoint, requestObj); 
        var options = {
            host: self.config.host,
            port: self.config.port,
            path: usersPath,
            method: 'GET'
        }
        logger.log(
            "info","[INFO] Requesting hades call - " + JSON.stringify(options)
        );
        http.get(
            options,
            function(hadesResponse) {
                var body = "";
                hadesResponse.on('data', function(incomingData) {
                    body += incomingData;
                });
                hadesResponse.on("end", function() {
                    if (hadesResponse.statusCode != 200) {
                        logger.log("error","[ERROR] error occurred" + 
                                   "while calling hades " + 
                                   JSON.stringify(body));
                        callBack({"error":true,"message": erroMessage}, 
                                 null);
                    }
                    else {
                        logger.log(
                            "info","response from hades " + JSON.stringify(body)
                        );
                        callBack(null, jsonParser.parse(body));
                    }
                });
            }
        ).on('error', function(e) {
            logger.log("error",
                "[ERROR] error occurred while communicating with hades"
            );
            callBack({"error": true, "message": e.message}, null);
        });
    }
    this.getClientByUserId = function(userId, callBack) {
        var requestObj = {
            "offset": 0,
            "limit": 10,
            "application":constants.APP_NAME,
            "userId": userId
        }
        var clientsPath = 
            this.getJsonQueryString(this.config.clientsEndpoint, requestObj);
        var options = {
            host: this.config.host,
            port: this.config.port,
            path: clientsPath,
            method: 'GET'
        }
        
        logger.log("info","Requesting hades call - " +JSON.stringify(options));
        http.get(
            options,
            function(hadesResponse) {
                var body = "";
                hadesResponse.on('data', function(incomingData) {
                    body += incomingData;
                });
                hadesResponse.on("end", function() {
                    if (hadesResponse.statusCode != 200) {
                        logger.log("error","error occurred" + 
                                   "while calling hades " + 
                                   JSON.stringify(body));
                        callBack({
                            "error":true,
                            "message": erroMessage
                        }, null);
                    }
                    else {
                        logger.log(
                            "info","response from hades " + JSON.stringify(body)
                        );
                        callBack(null, jsonParser.parse(body));
                    }
                });
            }
        ).on('error', function(e) {
            logger.log("error",
                "[ERROR] error occurred while communicating with hades"
            );
            callBack({"error": true, "message": e.message}, null);
          });
    }
    
    this.getJsonQueryString = function(url, data) {
        return url + "?jsonQuery=" + JSON.stringify(data);
    }
    
    this.GrantRevokeAccess = function(userId, clientId, 
                                      accessType, action, callBack) {
        var requestObject = {
            "targetUserId" : userId,
            "access": accessType,
            "action":action,
            "organisationIds":[clientId],
            "organisationType": "CLIENT",
            "userId": constants.MASTER_USER,
            "application": constants.APP_NAME
        }
        var data = JSON.stringify(requestObject);
        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        };
        host = this.config["host"];
        aclEndpoint = this.config["grantRevokeEndpoint"];
        var options = {
            host: host,
            port: this.config.port,
            path: aclEndpoint,
            method: 'POST',
            headers: headers
        };
        logger.log("info","options " + JSON.stringify(options));
        logger.log("info","data " + data);
        var request = http.request(options, function (res) {
            var response = "";
            try {
                res.on('data', function (incomingData) {
                    try {
                        response += incomingData;
                    } 
                    catch (e) {
                        logger.log("info",e.message);
                        callBack("Internal error occured", []);
                    }
                }).on('end', function () {
                    logger.log("info","Hades response" + response);
                    serviceResponse = JSON.parse(response);
                    if (serviceResponse["exception"] === null) {
                        logger.log("info","Access granted successfully")
                        callBack(null, serviceResponse);
                    } 
                    else {
                        logger.log(
                            "error",
                            "Excetion thrown by hades" +
                            JSON.stringify(serviceResponse["exception"])
                        );
                        callBack({"message" : "Internal error occred"}, null);
                    }
                }).on('error', function (e) {
                    logger.log(
                        "error",
                        "occred while granting access " + " ERROR = " + e.message
                    )
                    callBack({"error": true, "message": e.message}, []);
                });
            } 
            catch (e) {
                logger.log(
                    "error",
                    "occred while granting access " +
                    " ERROR = " + e.message
                )
                callBack({"message":"Internal error occured"}, []);
            }
        });
        request._headerSent = true;
        request.write(data);
        request.end();
        request.on('error', function (e) {
            logger.log("error",e.message);
            callBack(e.message, []);
        });
    }

    this.postUserDetails = function (config, userData, callBack) {
        fileManager.readFile(config,function(err,fileData){
            fileData = JSON.parse(fileData);
            var data = {
                name : userData.name,
                password : userData.password,
                email : userData.email,
                contactNumber : userData.mobile,
                organisationId : fileData.clientId,
                organisationType : 'CLIENT',
                application : constants.APP_NAME
            }
            logger.log("info",JSON.stringify(userData));
            if (userData["notificationType"] == constants.SMS) {
                data.organisationId = userData["clientId"];
            }
            logger.log(
                "info","USER DATA FOR ACCOUNT CREATION : " + JSON.stringify(data)
            );
            sendCreationRequest(data, callBack);
        });
    };

    var sendCreationRequest = function (jsonData, callBack) {
        var response = "";
        var data = JSON.stringify(jsonData);
        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        };
        var options = {
            host: self.config.host,
            port: self.config.port,
            path: "/hadesV2/users",
            method: 'POST',
            headers: headers
        };
        var request = http.request(options, function (res) {
            var response = "";
            try {
                res.on('data', function (incomingData) {
                    try {
                        response += incomingData;
                    } 
                    catch (e) {
                        logger.log("info",e.message);
                        callBack("Internal error occured", []);
                    }
                }).on('end', function () {
                    logger.log(
                        "info","NOTIFICATION SERVICE RESPONSE" + response
                    );
                    serviceResponse = JSON.parse(response);
                    if (serviceResponse["exception"] === null) {
                        logger.log(
                            "info","USER CREATED SUCCESSFULLY BY HADES."
                        );
                        callBack(null, serviceResponse);
                    } 
                    else {
                        logger.log(
                            "error",
                            "Excetion thrown by creation service" +
                            JSON.stringify(serviceResponse["exception"])
                        )
                        callBack({"message":"Internal error occured"}, null);
                    }
                }).on('error', function (e) {
                    logger.log(
                        "error",
                        "occred while creating User " + email +
                        " ERROR = " + e.message
                    );
                    callBack(e.message, []);
                });
            } 
            catch (e) {
                logger.log(
                    "error",
                    "occred while creating user " + email +
                    " ERROR = " + e.message
                )
                callBack("Internal error occured", []);
            }
        });
        request._headerSent = true;
        request.write(data);
        request.end();
        request.on('error', function (e) {
            logger.log("error", e.message)
            callBack(e.message, []);
        });
    }
}
module.exports = HadesCommunicator;
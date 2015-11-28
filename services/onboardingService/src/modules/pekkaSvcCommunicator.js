var fileManager = require("fs"),
    http = require("http"),
    util = require("util"),
    jsonParser = require("JSON"),
    constants = require("../utils/constants");
function PekkaSvcCommunicator(configFile, logger, expertsCommunicator) {
    var self = this;
    fileManager.readFile(
        configFile,
        function(err, data) {
            if (err != null) {
                throw new Error("Error while reading " + configFile)
            }
            else {
                self.config = jsonParser.parse(data)
            }
        }
    );
    this.createClient = function(userDetails, vertical,subVertical, callBack) {
        var self = this;
        expertsCommunicator.getVerticalSubverticalIds(
            vertical,
            subVertical,
            function(err, verticalId, subVerticalId) {
                if(err == null) {
                    self.postConfiguration(userDetails, verticalId, 
                                           subVerticalId, callBack);
                }
                else {
                    callBack({
                        "error":true,
                        "message":err.message
                    }, null);
                }
            }
        );
    }
    this.postConfiguration = function(userDetails, verticalId, subVerticalId, 
                                      callBack) {
        var response = "";
        var jsonData = {
            "clientName" : userDetails["businessName"],
            "contactName" : userDetails["name"],
            "contactEmail" : userDetails["email"],
            "timezoneId" : constants.ASIA_CALCUTTA_TIMEZONE_ID,
            "userId" : constants.DOORS_USER_ID,
            "countryCode" : constants.IN,
            "agencyDomainUrlId" : constants.LEADMANAGER_AGENCY_DOMAIN_URL_ID,
            "agencyId" : constants.LEADMANAGER_AGENCY_ID,
            "currencyCode" : constants.INR,
            "leadContactNumber" :userDetails["mobile"],
            "verticalId" : verticalId,
            "subVerticalId" : subVerticalId,
            "budget" : constants.DEFAULT_BUDGET,
            "domainUrl": constants.DOMAIN_URL,
            "launchType" : constants.SIGNUP_LAUNCH_TYPE,
            "feedStatusType" : constants.SUCCESS_FEED_STATUS_TYPE,
            "application": constants.APP_NAME
        }

        var data = JSON.stringify(jsonData);
        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        };
        clientEndpoint = this.config["clientEndpoint"];
        var options = {
            host: this.config.host,
            port: this.config.port,
            path: clientEndpoint,
            method: 'POST',
            headers: headers
        };
        logger.log("info", "options " + JSON.stringify(options));
        logger.log("info ", "data" + data);
        var request = http.request(options, function (res) {
            var response = "";
            try {
                res.on('data', function (incomingData) {
                    try {
                        response += incomingData;
                    } 
                    catch (e) {
                        logger.log("error", e.message);
                        callBack("Internal error occured", []);
                    }
                }).on('end', function () {
                    logger.log("info", "PEKKASERVICE RESPONSE" + response);
                    serviceResponse = JSON.parse(response);
                    if (serviceResponse["exception"] === null) {
                        logger.log(
                            "info",
                            "CLIENT CREATED SUCCESSFULLY" +"USING PEKKASVC."
                        )
                        serviceResponse["verticalId"] = verticalId;
                        serviceResponse["subVerticalId"] = subVerticalId
                        callBack(null, serviceResponse);
                    } 
                    else {
                        logger.log(
                            "error",
                            "Excetion thrown by pekkaSvc" +
                            JSON.stringify(serviceResponse["exception"])
                        )
                        var message = 
                            serviceResponse["exception"]["error"]["message"]
                        callBack({
                            "message":message 
                        }, null);
                    }
                }).on('error', function (e) {
                    logger.log(
                        "error",
                        "occred while creating client " + " ERROR = " + e.message
                    )
                    callBack(e.message, []);
                });
            } 
            catch (e) {
                logger.log(
                    "error",
                    "occred while creating client " + " ERROR = " + e.message
                )
                callBack("Internal error occured", []);
            }
        });
        request._headerSent = true;
        request.write(data);
        request.end();
        request.on('error', function (e) {
            logger.log("error","[ERROR]" + e.message)
            callBack(e.message, []);
        });
    }
}
module.exports = PekkaSvcCommunicator;
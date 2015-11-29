var hat = require("hat");
var fs = require('fs');
var paywith = function(logger, configuration) {
    var request, decodedBody;
    return function (req, res, next) {
        try {
            request = req.query;
            logger.info("got:" + JSON.stringify(request));
            logger.info("headers: " + JSON.stringify(req.headers));
            var selectionobject = {};
            //if (req.headers.origin != body.domainName) {
            //    //throw new Error("domain doesn't match");
            //}
            if (request && request.appKey) {
                selectionobject["appKey"] = request.appKey;
            }
            if (request && request.email) {
                selectionobject["email"] = request.email;
            }
            if (request && request.domainName) {
                selectionobject["domainName"] = request.domainName;
            }
            logger.info("selectionObject: " + JSON.stringify(selectionobject));
            if (!isEmpty(selectionobject)) {
                configuration.getFromDb(
                    selectionobject,
                    function (err, returnObject) {
                        if (err == null && !isEmpty(returnObject)) {
                            logger.info("object:" + returnObject[0]);
                            res.send(
                                { "status" :"Success", "merchant" : returnObject[0]
                                }
                            )
                        }
                        else {
                            res.send(
                                { "status" :"Success", "merchant" : []
                                }
                            )
                        }
                    }
                )
            }
        }
        catch (err) {
            logger.log("error", err.message);
            logger.log("error", err.stack);
            res.send(
                {
                    "status": "FAILED",
                    "error": err.message
                }
            );
        }
    }
    function isEmpty(object) {
        return !Object.keys(object).length;
    }
}
exports.get = paywith;

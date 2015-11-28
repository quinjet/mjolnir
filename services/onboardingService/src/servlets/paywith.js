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
            logger.info("selectionObject: " + JSON.stringify(selectionobject));
            if (!isEmpty(selectionobject)) {
                configuration.getFromDb(
                    selectionobject,
                    function (err, returnObject) {
                        if (err == null && !isEmpty(returnObject)) {
                            logger.info("asd" + returnObject[0].paymentOptions);
                            var activePayments = [];
                            for (var i=0 ; i < returnObject[0].paymentOptions.length; i++) {
                                if (returnObject[0].paymentOptions[i].isActive) {
                                    activePayments.push(returnObject[0].paymentOptions[i].name);
                                }
                            }
                            res.send(
                                { "status" :"Success", "paywith" : activePayments
                                }
                            )
                        }
                        else {
                            res.send(
                                { "status" :"Success", "paywith" : []
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

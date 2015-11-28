var hat = require("hat");
var fs = require('fs');
var transactionServlet = function(logger, transaction) {
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
            var isValid = false;
            if (request && request.appKey) {
                selectionobject["appKey"] = request.appKey;
                isValid = true;
            }

            logger.info("checking request valid or not: " + JSON.stringify(selectionobject));
            
            if(!isValid)
            {
                res.send(
                    {
                        "status": "FAILED",
                        "merchant": "Invalid request"
                    }
                );
            }
            else
            {
                logger.info("selectionobject: " + JSON.stringify(selectionobject));
                transaction.getFromDb(selectionobject, function(err, response){
                    if(err)
                    {
                        res.send(
                            {
                                "status": "FAILED",
                                "error": err
                            }
                        );
                    }
                    else
                    {
                        res.send(
                            {
                                "status": "SUCCESS",
                                "message": response
                            }
                        );
                    }
                });
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
exports.get = transactionServlet;

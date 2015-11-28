var hat = require("hat");
var fs = require('fs');
var paymentServlet = function(logger, configuration) {
    var request, decodedBody;
    return function (req, res, next) {
        try {
            decodedBody = decodeURIComponent(req.body);
            logger.info("got:" + decodedBody);
            logger.info("headers: " + JSON.stringify(req.headers));
            body = JSON.parse(decodedBody);
            var selectionobject = {};
            if (req.headers.origin != body.domainName) {
                //throw new Error("domain doesn't match");
            }
            if (body && body.appKey) {
                selectionobject["appKey"] = body.appKey;
            }
            if (req.headers.origin) {
               // add valid domain check
            }

            logger.info("checking request valid or not: " + JSON.stringify(body));
            isValid  = validateRequest(body);
            if(!isValid)
            {
                res.send(
                    {
                        "status": "failed",
                        "merchant": "response"
                    }
                );
            }
            else
            {
                configuration.getFromDb(
                    selectionobject,
                    function (err, returnObject) {
                        if (err == null && !isEmpty(returnObject)) {
                            logger.info("asd" + returnObject);
                            logger.info("merchant account validated.");
                            var paymentOptions = {"paymentOptions" : returnObject};
                            )
                        }
                        else 
                        {
                            res.send(
                                {
                                    "status": "FAILED",
                                    "error": err
                                }
                            );
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

    function generateKeyPairs() {
        var keys = ursa.generatePrivateKey();
        logger.info('keys:', keys);
        var privPem = keys.toPrivatePem('base64');
        logger.info('privPem:', privPem);
        var priv = ursa.createPrivateKey(privPem, '', 'base64');
        var pubPem = keys.toPublicPem('base64');
        logger.info('pubPem:', pubPem);
        var pub = ursa.createPublicKey(pubPem, 'base64');
        return {"privateKey":priv, "publicKey":pub};
    }

    function generateRacks() {
        var rack = hat.rack();
        return {"privateKey":rack(), "publicKey":rack()};
    }

    function validateRequest(request)
    {
        var isValid = false;
        if(request["paymentType"] == "ewallet")
        {
            if(request["userName"] && request["password"])
            {
                isValid = true;
            }
        }
        else
        {
            isValid = false;
        }
        return isValid;
    }
}
exports.post = paymentServlet;

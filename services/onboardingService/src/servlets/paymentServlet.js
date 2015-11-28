var hat = require("hat");
var fs = require('fs');
var paymentServlet = function(logger, configuration, paypalExpress) {
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
               body["origin"] = req.headers.origin;
            }
            body["origin"] = "http://www.sokrati.com/";

            logger.info("checking request valid or not: " + JSON.stringify(selectionobject));
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
                    function (err, dbResponse) {
                        if (err == null && !isEmpty(dbResponse)) {
                            logger.info("merchant account validated.");
                            logger.info("response from db :" + JSON.stringify(dbResponse));
                            if(dbResponse[0])
                            {
                                var paymentDetail = 
                                    getContextForPayment(
                                        body, 
                                        dbResponse[0].paymentOptions
                                    );
                                
                                if(paymentDetail)
                                {
                                    logger.info("paymentDetail for merchant: " + JSON.stringify(paymentDetail));
                                    if(paymentDetail["name"] == "paypal")
                                    {
                                        var context = JSON.parse(paymentDetail["context"]);
                                        paypalExpress.payExpress(
                                            body, 
                                            context, 
                                            function(err, resp){
                                                if(err)
                                                {
                                                     res.send(
                                                        {
                                                            "status": "ERROR",
                                                            "error": err
                                                        }
                                                    );   
                                                }
                                                else
                                                {
                                                    res.send(
                                                        {
                                                            "status": "SUCCESS",
                                                            "token": resp
                                                        }
                                                    );   
                                                }
                                            
                                        });
                                    } 
                                    else {
                                         res.send(
                                            {
                                                "status": "ERROR",
                                                "error": "Invalid Payment option"
                                            }, 500
                                        );
                                    }

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

    function getContextForPayment(request, paymentOptions)
    {
        var paymentDetail;
        logger.info("In getContextForPayment: ");
        logger.info("In request : " + JSON.stringify(request));
        logger.info("In request : " + JSON.stringify(paymentOptions));
        for (var i =0 ; i<paymentOptions.length;i++)
        {
            if(request["paymentMethod"] == paymentOptions[i]["name"])
            {
                logger.info("We found Match!! Lets Begin Transaction for " + paymentOptions[i]);
                paymentDetail = paymentOptions[i];
                break;
            }
        }
        return paymentDetail;
    }
}
exports.post = paymentServlet;

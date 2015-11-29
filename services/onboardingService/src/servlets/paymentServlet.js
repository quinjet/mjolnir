var hat = require("hat");
var fs = require('fs');
var paymentServlet = function(logger, configuration, transaction, paypalExpress, creditCardCheckout) {
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
               body["origin"] = req.headers.origin + "/";
            }

            // Change
            // body["origin"] = "http://www.sokrati.com/";

            logger.info("checking request valid or not: " + JSON.stringify(selectionobject));
            isValid  = validateRequest(body);
            if(!isValid)
            {
                res.send(
                    {
                        "status": "FAILED",
                        "merchant": "Invalid request"
                    }, 500
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
                                        body["currency"] = dbResponse[0].currency;
                                        var context = JSON.parse(paymentDetail["context"]);
                                        paypalExpress.payWithCredit(
                                            body, 
                                            context, 
                                            function(err, resp){
                                                if(err)
                                                {
                                                     res.send(
                                                        {
                                                            "status": "FAILED",
                                                            "error": err
                                                        }, 500
                                                    );   
                                                }
                                                else
                                                {
                                                    body["paymentStatus"] = "InProgress";
                                                    body["paymentToken"] = resp;
                                                    transaction.saveToDb(
                                                        body, 
                                                        function(err, txnResponse){
                                                            if (err)
                                                            {
                                                                res.send(
                                                                    {
                                                                        "status": "FAILED",
                                                                        "error": err
                                                                    }, 500
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
                                        });
                                    }
                                    else if(paymentDetail["name"] == "paypal_credit")
                                    {
                                        var context = JSON.parse(paymentDetail["context"]);
                                        creditCardCheckout.payWithCredit(
                                            body, 
                                            context, 
                                            function(err, resp){
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
                                                    var respStr = JSON.stringify(resp);
                                                    if(resp["id"] && resp["state"] &&
                                                       resp["state"] == "approved")
                                                    {
                                                        body["paymentStatus"] = "Completed";
                                                        body["paymentToken"] = resp["id"];
                                                    }
                                                    else
                                                    {
                                                        body["paymentStatus"] = "Failed";
                                                    }
                                                    body["transactionDetails"] = respStr;

                                                    transaction.saveToDb(
                                                        body, 
                                                        function(err, txnResponse){
                                                            if (err)
                                                            {
                                                                res.send(
                                                                    {
                                                                        "status": "FAILED",
                                                                        "error": err
                                                                    }, 500
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
                                            
                                        });
                                    } 
                                    else {
                                         res.send(
                                            {
                                                "status": "FAILED",
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
                                }, 500
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
                }, 500
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
        console.log(request["paymentType"]);
        console.log(request["creditCard"]);
        var isValid = false;
        if (request["paymentType"] == "ewallet" || 
            (request["paymentType"] == "card" && request["creditCard"]))
        {   
           if (request["paymentMethod"] && request["appKey"] &&
                request["transactionId"] && request["amount"])
            {
                isValid = true;
            }
 
        }
        return isValid;
    }

    function getContextForPayment(request, paymentOptions)
    {
        var paymentDetail;
        logger.info("In getContextForPayment: ");
        logger.info("In request : " + JSON.stringify(request));
        logger.info("In request : " + JSON.stringify(paymentOptions));
        for (var i =0 ; i<paymentOptions.length; i++)
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

var hat = require("hat");
var ursa = require('ursa');
var fs = require('fs');

var subscription = function(logger, configuration) {
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
            else if (body && body.domainName) {
                selectionobject["domainName"] = body.domainName;
            }
            if (body && body.paymentOptions)
            {
                for (var i =0 ; i<body.paymentOptions.length;i++)
                {
                    body.paymentOptions[i].context = JSON.stringify(body.paymentOptions[i].context);
                }
            }
            if (body && body.platforms)
            {
                for (var i =0 ; i<body.platforms.length;i++)
                {
                    body.platforms[i].context = JSON.stringify(body.platforms[i].context);
                }
            }
            if (!isEmpty(selectionobject)) {
                configuration.getFromDb(
                    selectionobject,
                    function (err, returnObject) {
                        if (err == null && !isEmpty(returnObject)) {
                            logger.info("asd" + returnObject);
                            logger.info("merchant account already exists. updating paymentOptions: " + body.paymentOptions);

                            var existingPaymentOptions = []
                            if (returnObject[0].paymentOptions) {
                                existingPaymentOptions = returnObject[0].paymentOptions
                            }
                            logger.info("existing payment options: " + existingPaymentOptions);
                            var done = [];
                            if (body.paymentOptions) {
                                for (var i = 0 ; i < body.paymentOptions.length ; i++){
                                    for (var j = 0 ; j < existingPaymentOptions.length; j++){
                                        if (body.paymentOptions[i].name == existingPaymentOptions[j].name) {
                                            existingPaymentOptions[j].isActive = body.paymentOptions[i].isActive
                                            done.push(body.paymentOptions[i].name);
                                        }
                                        else {
                                            break;
                                        }
                                    }
                                }
                                for (var i = 0 ; i < body.paymentOptions.length ; i++) {
                                    if (done.indexOf(body.paymentOptions[i].name) == -1) {
                                        existingPaymentOptions.push(body.paymentOptions[i])
                                    }
                                }
                            }
                            var updatedObject = {};
                            if (existingPaymentOptions) {
                                updatedObject["paymentOptions"] = existingPaymentOptions;
                            }
                            if (body.currency) {
                                updatedObject["currency"] = body.currency;
                            }
                            if (body.platforms) {
                                updatedObject["platforms"] = body.platforms;
                            }
                            if (body.webhookUrl) {
                                updatedObject["webhookUrl"] = body.webhookUrl;
                            }
                            configuration.updateToDb(
                                selectionobject,
                                updatedObject,
                                function(err, updateResponse) {
                                    logger.info("inside update callback");
                                    logger.log("err: " + err);
                                    logger.log("updateResponse: " + updateResponse);
                                    if (err == null) {
                                        configuration.getFromDb(
                                            selectionobject,
                                            function(err, updatedDoc) {
                                                if (!err) {
                                                    var x = updatedDoc[0]
                                                    if (x)
                                                    {
                                                        for (var i =0 ; i<x.platforms.length; i++)
                                                        {
                                                            logger.info("ads: " + x.platforms[i].context);
                                                            x.platforms[i].context = JSON.parse(x.platforms[i].context);
                                                            logger.info("adsx: " + x.platforms[i].context);
                                                        }
                                                    }
                                                    res.send(
                                                        {
                                                            "status": "success",
                                                            "merchant": x
                                                        }
                                                    );
                                                }
                                                else {
                                                    res.send(
                                                        {
                                                            "status": "failed",
                                                            "merchant": updatedDoc
                                                        },
                                                        500
                                                    );
                                                }
                                        })
                                    }
                                    else {
                                        res.send(
                                            {
                                                "status": "Failed",
                                                "merchant": err.message
                                            }
                                        );
                                    }
                                })
                        }
                        else {
                            var keys = generateRacks();
                            //var keys = generateKeyPairs();
                            logger.info("keys: " + JSON.stringify(keys));
                            body.appKey = keys.publicKey;
                            body.appSecret = keys.privateKey;
                            logger.info("creating merchant account: " + JSON.stringify(body));
                            configuration.saveToDb(
                                body,
                                function (err, response) {
                                    if (err == null) {
                                        logger.info("success");
                                        logger.info("res: " + response);
                                        res.send(
                                            {
                                                "status": "success",
                                                "merchant": response
                                            }
                                        );
                                    }
                                    else {
                                        logger.info("failed");
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
        var keys = ursa.generatePrivateKey(512, 3);
        logger.info('keys:', keys);
        var privPem = keys.toPrivatePem('base64');
        logger.info('privPem:', privPem);
        var priv = ursa.createPrivateKey(privPem, '', 'base64');
        logger.info("priv: " + JSON.stringify(priv));
        var pubPem = keys.toPublicPem('base64');
        logger.info('pubPem:', pubPem);
        var pub = ursa.createPublicKey(pubPem, 'base64');
        logger.info("pub: " + JSON.stringify(pub));
        return {"privateKey":privPem, "publicKey":pubPem};
    }

    function generateRacks() {
        var rack = hat.rack();
        return {"privateKey":rack(), "publicKey":rack()};
    }
}
exports.post = subscription;

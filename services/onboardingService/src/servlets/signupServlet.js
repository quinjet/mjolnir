var SecurityManager = require("../modules/encryptorAndDecryptor.js");

var postDetails = function(logger, requestValidator, Constants,
                           pekkaSvcCommunicator, hadesCommunicator,
                           configDbSvcCommunicator, mathHelper, userHelper,
                           signup, smsHandler) {
    var securityManager = new SecurityManager(),
        request, decodedBody,
        signUp = function(request, res) {
        securityManager.encrypt(
            request["password"],
            request["email"],
            function(err, response) 
            {
                if(err == null)
                {
                    processSignupRequest(err, response, request, res);
                }
            }
        );
    }

    return function(req, res, next)
    {
        try {
            decodedBody = decodeURIComponent(req.body);
            if (decodedBody == null || decodedBody == "")
            {
                res.send({
                    "status": "FAILED",
                    "message": "Invalid request"
                },500);
                return;
            }
            request = JSON.parse(decodedBody);
            logger.log('info',"POST Request Body :" + JSON.stringify(request));
            requestValidator.validateSignup(
                request,
                function (err, details) {
                    if (err.status !== 'Success') {
                        res.send(err,500);
                    } 
                    else {
                        logger.log("info", "Validate User Data Successful");
                        signUp(details, res);
                    }
                }
            );
        } 
        catch (err) {
            logger.log("error", err.message);
            logger.log("error", err.stack);
            res.send({
                "status": "FAILED",
                "error": err.message
            });
        }
    }

    function processSignupRequest(err, response, request, res) {
        logger.log("info","Encryption Successful");
        request["password"] = response["encryptedPassword"];
        request["salt"] = response["salt"];
        var clients = [request["businessName"]]
        configDbSvcCommunicator.getClientsByClientNames(
            clients,
            function(err, configDbResponse) 
            {
                if (err != null) 
                {
                    res.send({"message":err.message,"status":"FAILED"},500);
                    throw new Error(err.message);
                }
                else 
                {
                    if (configDbResponse["clients"].length > 0)
                    {
                        res.send({
                            "message":"Client already exists", 
                            "status":"FAILED"
                        });
                    }
                    else 
                    {
                        generateActivationCode(request, res);
                    }
                }
            }
        );
    }
    function generateActivationCode(request, res) {
        mathHelper.generateRandomNumber (
            Constants.VERIFICATION_CODE_LENGTH,
            function(err, mathHelperResp) {
                if (null == err) {
                    logger.log("info", "code generation successfull");
                    logger.log(mathHelperResp["activationCode"]);
                    request["key"] = mathHelperResp["activationCode"]
                    request["expiryTime"] = 
                        mathHelper.getExpiryTime(Constants.ACTIVATION_CODE_EXPIRY_TIME);
                    logger.log("debug", "ExpiryTime - " + request["expiryTime"]);
                    request["isDeleted"] = false;
                    createUserEntry(request, res);
                }
                else {
                    throw new Error(err["message"]);
                }
            }
        );
    }

    function createUserEntry(request, resp) {
        var filter = {
            'deviceId': request['deviceId']
        };
        userHelper.getUser(filter, function (err, response) {
            if (response === null) {
                hadesCommunicator.getUserByEmailId(request["email"], function(err, hadesResponse) {
                    if(err == null) {
                        if (hadesResponse["users"].length <= 0) {
                            logger.log("info", "no user with given email exists");
                            getUserDetailsbyEmailId(
                                request["email"],
                                processMongoUserCreation,
                                resp,
                                request
                            );
                        }
                        else {
                            resp.send({
                                "message":"User already exists",
                                "status":"FAILED"
                            });
                        }
                    }
                    else {
                        resp.send({
                            "status":"FAILED",
                            "message":"Error occurred while calling hades"
                        },500);
                    }
                });
            } 
            else if (response && response['email'] &&
                     response['email'] == request["email"] ) {
                logger.log("info", "Checking resend request for SMS");
                if (response["email"] == request["email"] &&
                    response["mobile"] == Number(request["mobile"]) &&
                    response["businessName"] == request["businessName"] &&
                    response["name"] == request["name"] &&
                    !response["activated"]) {
                    //Resend activation code.
                    logger.log("info", "resending the activation code");
                    var newResendCount = Number(response["resendCount"]) + 1;
                    var modifiedObject = {
                        'key': request["key"],
                        'expiryTime': request["expiryTime"],
                        'oldKey': response['key'],
                        "resendCount" : newResendCount
                    };
                    sendActivationMessage(request, resp, modifiedObject);
                }
                else {
                    resp.send({
                        "status": "FAILED",
                        "message": "Wrong resend request"
                    },500);
                }
            }
            else {
                resp.send({
                    "status": "FAILED",
                    "message": "Device is registered with another email"
                });
            }
        });
    }
    function processMongoUserCreation(err, getByemailIdResponse, resp, request) {
        if (err == null) {
            signup.saveToDb(request, function (err, response) {
                if (err === null) {
                    logger.log('info', "Details Pushed into DB");
                    sendActivationMessage(request, resp, null);
                } 
                else {
                    resp.send({
                        "status": "FAILED",
                        "message": response["error"]
                    }, 500);
                }
            });
        }
        else {
            resp.send({
                "message" : "User is already registered with different device",
                "status" : "FAILED"
            });
        }
    }

    function sendActivationMessage(request, resp, resendData) {
        var activationMessage = 
            Constants.ACTIVATION_TEXT.replace("__ACTIVATION_CODE__",request["key"]);
        smsHandler.sendMessage(
            request["mobile"], 
            activationMessage,
            function(err, activationResponse) {
                var updatedObject;
                if (err == null) {
                    if(null == resendData) {
                        updatedObject = {
                            'sentSMS': true,
                            'vendorMessageId': activationResponse["vendorResponse"]
                        }
                    }
                    else {
                        updatedObject = resendData;
                    }
                    updateUserEntry(request, resp, updatedObject);
                    logger.log("info", "activation code sent");
                    resp.send({
                        "status": "SUCCESS",
                        "message": "Activation code sent"
                    });
                }
                else {
                    resp.send({
                        "status": "FAILED",
                        "message": err.message
                    },500);
                    logger.log("error", "Error sending SMS : " + err)
                }
            }
        );
    }

    function updateUserEntry(request, resp, updateObj) {
        filter = {
            'email': request["email"],
            'phone': request["phone"]
        }
        signup.updateToDb(filter, updateObj, function (err, response) {
            if (err === null) {
                resp.send({
                    "status": response["status"],
                    "message": response["error"]
                });
            } 
            else {
                resp.send({
                    "status": "FAILED",
                    "error": err.message
                },500);
            }
        });
    }

    function getUserDetailsbyEmailId(email, callBack, resp, request) {
        var filter = {
            'email': email
        }
        userHelper.getUser(
            filter, 
            function(err, response) {
                if(response == null) {
                    callBack(null, response, resp, request);
                }
                else {
                    callBack({"error":"user exists"}, response, resp, request);
                }
            }
        );
    }
}
exports.get = postDetails;

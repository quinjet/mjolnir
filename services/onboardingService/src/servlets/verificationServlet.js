var SecurityManager = require("../modules/encryptorAndDecryptor.js");
var verify = function(logger, requestValidator, constants, pekkaSvcCommunicator,
                      hadesCommunicator, configDbSvcCommunicator, userHelper,
                      mathHelper, signup, userConfig) {
    var securityManager = new SecurityManager(),
        request, decodedBody;
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
            logger.log(
                'info',"POST Request Body verificationServlet :" + 
                JSON.stringify(request)
            );
            requestValidator.validateVerificationRequest(
                request,
                function (err, details) {
                    if (err.status !== 'Success') {
                        res.send(err,500);
                    } 
                    else {
                        logger.log(
                            "info", 
                            "Validated verification request successfully"
                        );
                        processSMSVerification(request, details, res);
                    }
                }
            );
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

    function processSMSVerification(request, details, res) {
        filter = {
            "email": request["email"],
            "mobile": request["mobile"],
            "deviceId": request["deviceId"]
        }
        logger.log("info", JSON.stringify(filter));
        userHelper.getUser(filter, function (err, userDetails) {
            if (err === null) {
                if (userDetails['activated'] == true) {
                    res.send({"message":"User account is already verified","status":"FAILED"});
                } 
                else if (userDetails["key"] == request["activationCode"]) {
                    verifyCode(userDetails, res);
                }
                else {
                    var updatedObject = {
                        "status": "FAILED",
                        "step": "verification"
                    }
                    updateUserEntry(userDetails, res, updatedObject);
                    res.send({
                        "staus":"FAILED",
                        "message": "Wrong activation code"
                    },500);
                }
            } 
            else {
                if(null != userDetails) {
                    var updatedObject = {
                        "status": "FAILED",
                        "step": "verification"
                    }
                    updateUserEntry(userDetails, res, updatedObject);
                }
                else {
                    logger.log("error","REQUESTED USER DETAILS NOT FOUND");
                }
                res.send({
                    "status": "FAILED",
                    "message": err.message
                });
            }
        });
    }

    function updateUserEntry(request, resp, updateObj) {
        filter = {
            'email': request["email"],
            'phone': request["phone"]
        }
        signup.updateToDb(filter, updateObj, function (err, response) {
            if (err === null) {
                return;
            } 
            else {
                resp.send({
                    "status": "FAILED",
                    "error": err.message
                },500);
            }
        });
    }

    function verifyCode(userDetails, res) {
        var now = new Date();
        logger.log("info","expiryDate - " + userDetails["expiryTime"]);
        logger.log("info","now - " + now);
        if (userDetails["expiryTime"] > now) {
            hadesCommunicator.getUserByEmailId(
                userDetails["email"],
                function(err, hadesResponse) {
                    if(err == null) {
                        if (hadesResponse["users"].length <= 0) {
                            logger.log("info", "no user with given email exists");
                            processClientCreation(userDetails,res);
                        }
                        else {
                            var updatedObject = {
                                "status": "FAILED",
                                "step": "Client creation (User exists)",
                                "activated": true
                            }
                            updateUserEntry(userDetails, res, updatedObject);
                            res.send({
                                "message":"User already exists","status":"FAILED"
                            });
                        }
                    }
                    else {
                        var updatedObject = {
                            "status": "FAILED",
                            "step": "Client creation (Hades error)"
                        }
                        updateUserEntry(userDetails, res, updatedObject);
                        res.send({
                            "status":"FAILED",
                            "message":"Error occurred while calling hades"
                        },500);
                    }
                }
            )
        }
        else {
            var updatedObject = {
                "status": "FAILED",
                "step": "verification (Code Expired)"
            }
            updateUserEntry(userDetails, res, updatedObject);
            res.send({
                "status":"FAILED",
                "message": "Activation code expired"
            },500);
        }
    }

    function processClientCreation(userDetails, res) {
        pekkaSvcCommunicator.createClient(
            userDetails,
            constants.UNMAPPED_VERTICAL,
            constants.UNMAPPED_SUBVERTICAL,
            function(err, pekkaResponse) {
                if(err == null) {
                    logger.log("info", 
                               "client creation successFull. "+
                               "clientId " + pekkaResponse["clientId"]);
                    var updatedObject = {
                        "clientId": pekkaResponse["clientId"],
                        "verticalId": pekkaResponse["verticalId"],
                        "subVerticalId": pekkaResponse["subVerticalId"]
                    }
                    userDetails["clientId"] = pekkaResponse["clientId"];
                    updateUserEntry(userDetails, res, updatedObject);
                    createUser(userDetails, res);
                }
                else{
                    var updatedObject = {
                        "status": "FAILED",
                        "step": "Client creation"
                    }
                    updateUserEntry(userDetails, res, updatedObject);
                    res.send({
                        "status": "FAILED",
                        "message": err["message"]
                    });
                }
            }
        );
    }

    function createUser(userData, resp) {
        securityManager.decrypt(
            userData,
            function (err, decryptedPassword) {
                if (err === null) {
                    userData.password = decryptedPassword;
                    hadesCommunicator.postUserDetails (
                        userConfig, userData,
                        function (err, response) {
                            if (err === null) { 
                                grantAccess(userData, response, resp);
                            } 
                            else {
                                logger.log("error" , "error: " + err);
                                var updateObj = {
                                    'activated': false,
                                    "status": "FAILED",
                                    "step":"Hades User Creation"
                                }
                                updateUserEntry(userData, resp, updateObj);
                            }
                        }
                    );
                } 
                else {
                    resp.send(err);
                }
            }
        );
    }

    function grantAccess(userData, response, resp) {
        hadesCommunicator.GrantRevokeAccess(
            response.userId,
            userData["clientId"],
            constants.READ,
            constants.GRANT,
            function(err, aclResponse) {
                if(err != null) {
                    var updateObj = {
                        'activated': true,
                        "status": "FAILED",
                        "step":"Hades Access GRANT",
                        "userId": response.userId
                    }
                    updateUserEntry(userData, resp, updateObj);
                    resp.send({"message":err.message,"status":"FAILED"});
                }
                else {
                    var updateObj = {
                        'activated': true,
                        "status": "SUCCESS",
                        "step":"Hades Access grant",
                        "userId":response.userId
                    };
                    updateUserEntry(userData, resp, updateObj);
                    resp.send({
                        "status":"SUCCESS",
                        "message":"User creation successful"
                    });
                }
            }
        );
    }
}
exports.post = verify;

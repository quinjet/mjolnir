var login = function(logger, requestValidator, constants, pekkaSvcCommunicator,
                     hadesCommunicator, configDbSvcCommunicator, userHelper,
                     mathHelper, signup, userConfig, config) {
    var request, decodedBody;
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
                'info',
                "POST Request Body verificationServlet :" + 
                JSON.stringify(request)
            );
            requestValidator.validateLoginRequest(
                request,
                function (err, details) {
                    if (err.status !== 'Success') {
                        res.send(err,500);
                    } 
                    else {
                        logger.log(
                            "info", "Validated login request successfully"
                        );
                        processLogin(details, res)
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
    function processLogin(request, res) {
        var client = null;
        hadesCommunicator.getUserByEmailId( request['email'], function(err, userDetails) {
            if(err === null && userDetails['users'].length != 0) {
                hadesCommunicator.getClientByUserId(userDetails['users'][0]['id'], function(err, clientDetails) {
                    if (err == null)
                    {
                        client = removeDummyClientFromClientDetails(clientDetails);
                        if (null == client)
                        {
                            res.send({
                              "status": "FAILED",
                              "error": "Active Client not found for the user"
                            });
                        }
                        else
                        {
                            processExistingClient(
                                client, userDetails, request, res
                            );
                        }
                    }
                    else
                    {
                        res.send({
                            "status": "FAILED",
                            "error": err.message
                        });
                        logger.log("error", "REQUESTED CLIENT FOUND FOR USER");
                    }
                });
            }
            else {
                var errMsg = null;
                if(err != null){
                    errMsg = err.message;
                }
                res.send({
                    "status": "FAILED",
                    "error": errMsg
                });
                logger.log("error", "REQUESTED USER NOT FOUND");
            }
        });
    };
    function updateExtraDetails(signUpRequest, response, updateObj, res) {
        signup.updateToDb(
            signUpRequest,
            updateObj, 
            function (err) {
                if (err === null) {
                    logger.log("info","New user created: " + response);
                    res.send({
                        "status": "SUCCESS",
                        "error": null,
                        "userId": response.userId,
                        "clientId": response.clientId,
                        "verticalId": response.verticalId,
                        "subVerticalId": response.subVerticalId
                    });
                } 
                else {
                    res.send({
                        "status": "FAILED",
                        "error": err.message
                    });
                }
            }
        );
    }
    
    function removeDummyClientFromClientDetails(clientDetails)
    {
        var i = 0, client = null, clients = clientDetails["clients"];
        for (i = 0; i < clients.length; i = i + 1)
        {
            if (clients[i]['id'] != config.dummyClient)
            {
                client = clients[i];
                break;
            }
        }
        return client;
    }
    function saveDetails(signUpRequest, res, updateObj) {
        signup.saveToDb(signUpRequest, function (err, response) {
            if (err === null) {
                logger.log("info", "Details Pushed into DB");
                updateExtraDetails(
                    signUpRequest, response, updateObj, res
                );
            } 
            else {
                res.send({
                    "status": "FAILED",
                    "error": response["error"]
                });
            }
        });
    }
    function processExistingClient(
        client, userDetails, request, res
    ) {
        var combinationFilter = {
            'deviceId': request['deviceId'],
            'userId': userDetails['users'][0]['id'],
            'clientId': client['id']
        };
        var deviceIdFilter = {
            'deviceId': request['deviceId']
        };
        var userClientFilter = {
            'userId': userDetails['users'][0]['id'],
            'clientId': client['id']
        };
        var filter = {
            'combinationFilter': combinationFilter,
            'deviceIdFilter': deviceIdFilter,
            'userClientFilter': userClientFilter
        };
        signup.isDetailsExist(filter, function(err, response) { 
            var loginCombinationExists = response['combinationFilter'];
            logger.log("[INFO] Login Combination: "+ loginCombinationExists);
            if(loginCombinationExists != true) {
                var deviceIdExists = response['deviceIdFilter'];
                var userClientExists = response['userClientFilter'];
                if(deviceIdExists === true &&
                   userClientExists === true){
                    logger.log("[INFO] USER LOGGING IN WRONG DEVICE");
                    res.send({
                        "status": "Please login in your registered device",
                        "error": null
                    });
                }
                else if(deviceIdExists === true &&
                        userClientExists === false){
                    logger.log("info",
                               "ANOTHER USER IS BINDED TO THE DEVICE. " +
                               "PLEASE SIGN UP ON ANOTHER DEVICE");
                    res.send({
                        "status": "Please sign up on another device",
                        "error": null
                    });
                }
                else if(deviceIdExists === false &&
                        userClientExists === true) {
                    logger.log("info", "PLEASE LOGIN IN REGISTERED DEVICE");
                    res.send({
                        "status": "Please login in registered device",
                        "error": null
                    });
                }
                else {
                    logger.log(
                        "info", 
                        "USER DETAILS FOUND BUT DEVICE UNREGISTERED"
                    );
                    var phoneNumber = 
                        userDetails['users'][0]['contactNo']
                    if (null != phoneNumber) {
                        phoneNumber = phoneNumber.replace("+","")
                        phoneNumber = phoneNumber.replace("-", "")
                    }
                    var signUpRequest = {
                        "name": userDetails['users'][0]['name'],
                        "password": "s0kR@t!",
                        "email": request['email'],
                        "mobile": Number(phoneNumber),
                        "website": constants.DOMAIN_URL,
                        "salt": "salt",
                        "deviceId": request["deviceId"],
                       "notificationType": constants.SMS,
                        "key": 9999,
                        "userId": userDetails['users'][0]['id'],
                        "clientId": client['id']
                    };
                    var updateObj = {
                        "sentSMS": true,
                        "activated": true
                    };
                    clientId = client['id'];
                    configDbSvcCommunicator.getVerticalSubverticalByClientId(
                        clientId, 
                        function(err, configDbResponse) {
                            if (err == null) {
                                var subVerticals;
                                if (configDbResponse != null) {
                                    subVerticals = 
                                        configDbResponse["subVerticals"];
                                }
                                if (subVerticals != undefined &&
                                    subVerticals.length > 0) {
                                    signUpRequest["verticalId"] =
                                        subVerticals[0].verticalId;
                                    signUpRequest["subVerticalId"] = 
                                        subVerticals[0].expertSubVerticalId
                                }
                                saveDetails(signUpRequest, res, updateObj);
                            }
                            else {
                                res.send({
                                    "status":"Error calling configDbSvc",
                                    "error": true
                                });
                            }
                        }
                    );
                }
            }
            else {
                logger.log("info","LOGIN COMBINATION FOUND");
                userHelper.getUser(combinationFilter, function(err, response){
                    if (err == null) {
                        res.send({
                            "status": "SUCCESS",
                            "error": null,
                            "userId": response.userId,
                            "clientId": response.cilentId,
                            "verticalId": response.verticalId,
                            "subVerticalId": response.subVerticalId
                        });
                    }
                    else {
                        res.send({
                            "status": "FAILED",
                            "error": "Something blew up"
                        });
                    }
                });
            }
        });
    }
}
exports.post = login;

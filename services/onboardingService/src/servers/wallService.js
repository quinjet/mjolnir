"use strict";

var express = require('express'),
    app = express(),
    http = require('http'),
    winston = require('winston'),
    errorHandling = require('../lib/middleware/errorHandling'),
    log = require('../lib/middleware/fileLogger'),
    userConfig = "/etc/sokrati/config/wallService/userDetails.cfg",
    mongoUserConfig = "/etc/sokrati/db/wall_db.cfg",
    config = require('/etc/sokrati/config/wallService/wallService.json'),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({ filename: config.logFile, 
                                            handleExceptions: true,
                                            json: true})
        ]
    }),

    RequestValidator = require('../utils/requestValidator'),
    requestValidator = new RequestValidator(logger),

    constants = require("../utils/constants.js"),

    SMSHandler = require("../modules/SMSHandler/smsSender.js"),
    smsHandler = new SMSHandler(constants.SMS_CONFIG, logger),

    ExpertsCommunicator = require("../modules/expertDbSvcCommunicator"),
    expertsCommunicator = new ExpertsCommunicator(config.expertRestAccessor, logger),

    PekkaSvcCommunicator = require("../modules/pekkaSvcCommunicator"),
    pekkaSvcCommunicator = 
        new PekkaSvcCommunicator(config.pekkaRestAccessor, logger, 
                                 expertsCommunicator),

    ConfigDbSvcCommunicator = require("../modules/configDbSvcCommunicator"),
    configDbSvcCommunicator =  
        new ConfigDbSvcCommunicator(config.configDbRestAccessor, logger),

    // Getting connection with mongoDb.
    MongoConnector = require("../modules/mongoConnector.js"),
    mongoConnector = new MongoConnector(),

    MathHelper = require("../modules/numberGenerator"),
    mathHelper = new MathHelper(logger),

    HadesCommunicator = require("../modules/hadesCommunicator"),
    hadesCommunicator = 
        new HadesCommunicator(config.hadesRestAccessor, logger),

    bodyParser = require('body-parser'),

    MongoConnector = require("../modules/mongoConnector.js"),
    mongoConnector = new MongoConnector(logger),

    getUserDetails, signup;
/**
 * Load some of the express middlewares
 * Way too cool in handling routine stuff, eliminates a lot of 
 * boilerplate
 */

/*Require all servlets */

var signupServlet = require('../servlets/signupServlet'),
    verificationServlet = require('../servlets/verificationServlet'),
    loginServlet = require('../servlets/loginServlet'),
    detailsServlet = require('../servlets/detailsServlet'),
    pingServlet = require('../servlets/pingServlet');

app.use(log.getFileLogger(express.logger, config.expressLogFile));
app.use(function(req, res, next) {
    try {
        var data='';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
           data += chunk;
        });
        req.on('end', function() {
            req.body = data;
            next();
        });
    }
    catch(err) {
        res.send({"error": err.message});
    }
});
exports.start = function(port) {
    /*
        connect to mongoDb via mongoose
    */
    mongoConnector.connect(
        mongoUserConfig, 
        function (err, connection) {
            //Setting connection in dbAccessor.
            var wallDbAccessor = require("../models/wallDbAccess.js"),
                signupDb = new wallDbAccessor();
            signupDb.setConnection(connection);
            //Setting up collections models
            var Signup = require("../models/signup.js"),
            GetUserDetails = require("../models/getUserDetails.js");
            signup = new Signup(logger);
            getUserDetails = new GetUserDetails(logger);
            init();
        }
    );
    /*
        initializing signup servlet
    */
    function init() {
        app.post(
            '/wallService/signup', 
            signupServlet.get(logger, requestValidator, constants,
                              pekkaSvcCommunicator, hadesCommunicator,
                              configDbSvcCommunicator, mathHelper,
                              getUserDetails, signup, smsHandler)
        );
        /*
            initializing verification servlet
        */
        app.post(
            '/wallService/verify',
            verificationServlet.post(logger, requestValidator, constants,
                                     pekkaSvcCommunicator, hadesCommunicator,
                                     configDbSvcCommunicator, getUserDetails,
                                     mathHelper, signup, userConfig)
        );

        app.post(
            '/wallService/login',
            loginServlet.post(logger, requestValidator, constants,
                              pekkaSvcCommunicator, hadesCommunicator,
                              configDbSvcCommunicator, getUserDetails, 
                              mathHelper, signup, userConfig, config)
        );
        app.get(
            '/wallService/details',
            detailsServlet.get(logger, constants, getUserDetails, userConfig)
        );

        app.get('/wallService/ping', pingServlet.get(logger, constants));
        logger.log("info", "wallService has started on port: %s", port); 
        app.listen(port);
        /*
        * Finally Use the Error Handling Middleware to log any errors which may be 
        * thrown above
        */
        app.use(errorHandling.errorHandler);
    }
};

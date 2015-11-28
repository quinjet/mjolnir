"use strict";

var express = require('express'),
    app = express(),
    http = require('http'),
    logger = require('winston'),
    errorHandling = require('../lib/middleware/errorHandling'),
    log = require('../lib/middleware/fileLogger'),
    MongoConnector = require("../modules/mongoConnector.js"),
    mongoConnector = new MongoConnector(logger),

    bodyParser = require('body-parser');
    //logger.add(logger.transports.File, { filename: 'quinjet.log', level: 'info',handleExceptions: true, maxsize: 5242880,maxFiles: 10});
/*Require all servlets */
var mongoUserConfig = "/etc/sokrati/db/asgard.cfg";
var subscriptionServlet = require('../servlets/subscriptionServlet');
var paywithServlet = require('../servlets/paywith');
var paymentServlet = require('../servlets/paymentServlet');
var configuration, paypalExpress, creditCardCheckout;
var confirmPaymentServlet = require('../servlets/confirmPaymentServlet');
var transactionServlet = require('../servlets/transactionServlet');
var configuration, paypalExpress, transaction;

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
    mongoConnector.connect(mongoUserConfig, function (err, connection) {
        logger.info("connected");
        var AsgardDbAccess = require("../models/asGuardDbAccess"),
            asgardDbAccess = new AsgardDbAccess();
            asgardDbAccess.setConnection(connection);
            var Configuration = require("../models/configuration");
            configuration = new Configuration();
            var PaypalExpress = require("../modules/paypalExpressCheckout");
            paypalExpress = new PaypalExpress();
            var CreditCardCheckout = require("../modules/CreditCardCheckout");
            creditCardCheckout = new CreditCardCheckout();
            var Transaction = require("../models/transactions");
            transaction = new Transaction();
        init();
    })
    /*
        initializing signup servlet
    */
    function init() {
        app.post(
            '/onboardingService/subscribe', 
            subscriptionServlet.post(logger, configuration)
        );
        app.get(
            '/onboardingService/payWith',
            paywithServlet.get(logger, configuration)
        );
        app.post(
            '/transactionService/payment',
            paymentServlet.post(logger, configuration, transaction, paypalExpress)
        );
        app.post(
            '/transactionService/confirmPayment',
            confirmPaymentServlet.post(logger, configuration, transaction, paypalExpress)
        );
        app.get(
            '/transactionService/transactions',
            transactionServlet.get(logger, transaction)
        );
        logger.log("info", "onboardingService has started on port: %s", port); 
        app.listen(port);
        /*
        * Finally Use the Error Handling Middleware to log any errors which may be 
        * thrown above
        */
        app.use(errorHandling.errorHandler);
    }
};

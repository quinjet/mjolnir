var PaypalCreditRestApi = require('paypal-rest-sdk'),
    fs = require('fs'),
    util = require('util'),
    url = require('url');
/*
    This modules connects to mongo database. Gets path of config file.
    Reads this config file converts it to JSON and creates MONGO URI string.
    Connects to database and sends the response and error to callback function.
*/
function PaypalCredit(logger) {

    this.payWithCredit = function(req, token, callback) {
        console.log("Request: " + req);
        console.log("Token: " + token);
        var paypal = require('paypal-rest-sdk');
        paypal.configure({
            "host" : "api.sandbox.paypal.com",
            "port" : "",            
            "client_id" : token["clientId"],
            "client_secret" : token["clientSecret"]
        });
        console.log("Paypal: " + paypal);
        // if(!req["creditCard"]) {
        //     callback("Invalid Credit Card Details", null);
        // }
        var payment = {
              "intent": "sale",
              "payer": {
                "payment_method": "credit_card",
                "funding_instruments": [{
                  "credit_card": req["creditCard"]
                }]
              },
              "transactions": [{
                "amount": {
                  "total": req["amount"],
                  "currency": "USD"
                },
                "description": "My awesome payment"
              }]
            };
        paypal.payment.create(payment, function(error, resp) {
            if (error) {
               callback(error, null);
            } else {
                console.log("Create Credit-Card Response");
                callback(null, resp);
            }
        });
    }  
}
module.exports = PaypalCredit;

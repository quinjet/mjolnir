var PaypalExpressCheckout = require('paypal-express-checkout'),
    fs = require('fs'),
    util = require('util'),
    url = require('url');
/*
    This modules connects to mongo database. Gets path of config file.
    Reads this config file converts it to JSON and creates MONGO URI string.
    Connects to database and sends the response and error to callback function.
*/
function PaypalExpress(logger) {

    this.payWithCredit = function(req, token, callback) {
        console.log(req);
        console.log(token);

        var paypal = PaypalExpressCheckout.init(token["userName"],
                                               token["password"], 
                                               token["appSecret"],
                                               req["callbackUrl"] + "#success", 
                                               req["callbackUrl"] + "#cancel",
                                               []);
        console.log(paypal);
        paypal.pay(req["transactionId"], req["amount"], "transactionsq", req["currency"], function(err, respURL) {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            else
            {
                var parsedUrl = url.parse(respURL, true);
                var query = parsedUrl.query;
                if(query && query["token"])
                {
                    callback(err, query["token"]);
                } else
                {
                    callback(err, null);
                }
            }
        });
    }  

    this.confirmPayment = function(req, token, callback) {
        console.log(req);
        console.log(token);

        var paypal = PaypalExpressCheckout.init(token["userName"],
                                               token["password"], 
                                               token["appSecret"],
                                               req["callbackUrl"] + "#success", 
                                               req["callbackUrl"] + "#cancel",
                                               []);
        console.log(paypal);
        paypal.detail(req["paymentToken"], req["payerId"], function(err, data, invoiceNumber, price) {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            else
            {
                callback(err, data);
            }
        });
    }  
}
module.exports = PaypalExpress;

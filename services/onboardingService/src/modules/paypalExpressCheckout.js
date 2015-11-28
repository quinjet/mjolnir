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

    this.payExpress = function(req, token, callback) {
        console.log(req);
        console.log(token);

        var paypal = PaypalExpressCheckout.init(token["userName"],
                                               token["password"], 
                                               token["appSecret"],
                                               req["origin"] + "#success", 
                                               req["origin"] + "#cancel",
                                               []);
        console.log(paypal);
        paypal.pay(req["transactionId"], req["amount"], "transactionsq", req["currencyCode"], function(err, respURL) {
            if (err) {
                console.log(err);
            }
            var parsedUrl = url.parse(respURL, true);
            var query = parsedUrl.query;
            if(query && query["token"])
            {
                callback(err, query["token"]);
            } else
            {
                callback(err, null)
            }
            
        });
    }  
}
module.exports = PaypalExpress;

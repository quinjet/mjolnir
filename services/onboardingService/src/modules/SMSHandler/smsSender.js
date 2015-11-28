var vendorList = require("./vendors"),
    jsonParser = require("JSON"),
    fileManager = require("fs"),
    util = require("util"),
    http = require("http"),
    options = {
        host: null,
        path: null,
        method: 'GET'
    };
function SMSHandler(config, logger) {
    var vendor, userName, password, sender, self;
    self = this;
    fileManager.readFile(
        config, 
        function (err, data) {
            if (err != null) {
                throw new Error("Error while reading file");
            }
            else {
                var config = jsonParser.parse(data);
                vendor = config["vendorName"];
                userName = config["userName"];
                password = config["password"];
                sender = config["sender"];
                if (vendorList.SUPPORTED_VENDORS.indexOf(vendor) == -1) {
                    throw new Error(
                        "Supported vendors are " + SUPPORTED_VENDORS
                    );
                }
                switch(vendor) {
                    case vendorList.UNICEL:
                        self.vendorParams = require("./unicelParams");
                        self.vendorParams.userName = userName;
                        self.vendorParams.password = password;
                        self.vendorParams.sender = sender;
                        break;
                    default:
                        throw new Error(
                            "Supported vendors are " + SUPPORTED_VENDORS
                        );
                }
            }
        });
    this.sendMessage = function(phoneNumber, text , callBack) {
        if (this.vendorParams == undefined || this.vendorParams == null) {
            throw new Error("Initialize this module with proper vendor");
        }
        if (this.vendorParams.VENDOR_NAME != undefined && 
            this.vendorParams.VENDOR_NAME != null) {
            
            switch(this.vendorParams.VENDOR_NAME) {
                case vendorList.UNICEL:
                    this.sendSMSViaUnicel(phoneNumber, text, callBack);
                    break;
            }
        }
    };
    this.sendSMSViaUnicel = function(receiver, text, callBack) {
        
        var postToUnicel = function(unicelParams, receiver, text, callBack) {
            var url = "";
            url = 
                url.concat(unicelParams.UNICEL_SEND_MESSAGE_ENDPOINT)
                   .concat("?")
                   .concat(unicelParams.UNICEL_USERNAME)
                   .concat("=")
                   .concat(unicelParams.userName)
                   .concat("&")
                   .concat(unicelParams.UNICEL_PASSWORD)
                   .concat("=")
                   .concat(unicelParams.password)
                   .concat("&")
                   .concat(unicelParams.UNICEL_SENDER_ID)
                   .concat("=")
                   .concat(unicelParams.sender)
                   .concat("&")
                   .concat(unicelParams.UNICEL_RECEIVER_PARAM)
                   .concat("=")
                   .concat(receiver)
                   .concat("&")
                   .concat(unicelParams.UNICEL_MSG_PARAM)
                   .concat("=")
                   .concat(encodeURIComponent(text));
            if (text.length > unicelParams.MAX_LENGTH) {
                url =
                    url.concat("&")
                       .concat(unicelParams.UNICEL_IS_LONG_MSG)
                       .concat("=")
                       .concat("1");
            }
            options.host = unicelParams.UNICEL_URL;
            options.path = url;
            http.request(options, 
                         function(response) {
                             var str = '';
                             response.on('data', function (chunk) {
                                 str += chunk;
                             });
                             response.on('end', function () {
                                 logger.log("info", "response from unicel " + str);
                                 callBack(
                                     null, 
                                     {
                                         "vendorResponse":str,
                                         "status":"sent",
                                         "error":null
                                     }
                                 );
                             });
                         }).end();
        }
        logger.log("info", "sending message using unicel sms provider");
        logger.log("info", "senderId " + this.vendorParams.sender);
        logger.log("info", "receiver " + receiver);
        logger.log("info", "text ", + text);
        postToUnicel(this.vendorParams, receiver, text, callBack);
    };
}
module.exports = SMSHandler;
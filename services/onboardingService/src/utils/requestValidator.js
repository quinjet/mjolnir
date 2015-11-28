var errorStatus = {
    'error': true,
    'status': 'Failed'
}
var successStatus = {
        'error': false,
        'status': 'Success'
}
var RequestValidator = function() 
{
    this.validateVerificationRequest = function(request, callBack) {
        if (!request.hasOwnProperty("deviceId") ||
            !request.hasOwnProperty("activationCode") ||
            !request.hasOwnProperty("mobile") ||
            !request.hasOwnProperty("email")) 
        {
            throw new Error("mobile, email, activationCode and deviceId" +
                            "are mandatory");
            return callBack(error, request);
        }
        else if (request["deviceId"] === "" ||
                 request["activationCode"] === "" ||
                 request["mobile"] === "" ||
                 request["email"] === "") 
        {
            throw new Error("mobile, email, activationCode and deviceId" + 
                            "should not be empty");
            return callBack(error, request);
        }
        else 
        {
            return callBack(successStatus, request);
        }
    },
    this.validateSignup = function (request, callback) {
        var emailRegex = 
            /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (!request.hasOwnProperty("name") || 
            !request.hasOwnProperty("mobile") || 
            !request.hasOwnProperty("email") ||
            !request.hasOwnProperty("deviceId") ||
            !request.hasOwnProperty("businessName") ||
            !request.hasOwnProperty("password")) 
        {
            throw new Error("name, email, mobile, deviceId, businessName" + 
                            "and password are mandatory in request");
            return callback(errorSatus, request);
        }
        else if (null == request["name"] ||
                 null == request["mobile"] ||
                 null == request["email"] ||
                 null == request["deviceId"] ||
                 null == request["businessName"] ||
                 null == request["password"]) 
        {
            throw new Error("name, email, mobile, deviceId" + 
                            "and businessName can not be null");
        } 
        else if (typeof request["name"] != "string" && 
                 typeof request["mobile"] != "string" && 
                 typeof request["email"] != "string") 
        {
            throw new Error('name, email and mobile should be string.')
            return callback(errorStatus, request);
        }
        else if ("" == request["name"] ||
                 "" == request["mobile"] ||
                 "" == request["email"] ||
                 "" == request["deviceId"] ||
                 "" == request["businessName"] ||
                 "" == request["password"])
        {
            throw new Error("name, email, mobile, deviceId and businessName" + 
                            "can not be empty");
            return callback(errorStatus, request);
        }
        else if (!emailRegex.test(request["email"]))
        {
            throw new Error('email is invalid');
            return callback(errorStatus,request);
        }
        else if (request.hasOwnProperty('expiryTime') ||
                 request.hasOwnProperty('sentSMS') ||
                 request.hasOwnProperty('activated') ||
                 request.hasOwnProperty('vendorMessageId') ||
                 request.hasOwnProperty('salt') ||
                 request.hasOwnProperty('key')) 
        {
            console.log("[INFO] Params to be set from backend are coming in" + 
                        "request. attack alert");
            throw new Error("Invalid paramters in incoming request.");
            return callback(errorStatus, request);
        }
        else 
        {
            callback(successStatus, request);
        }
    },
    this.validateLoginRequest = function (request, callback) {
        if(!request.hasOwnProperty("deviceId") ||
           !request.hasOwnProperty("email") ||
           !request.hasOwnProperty("password"))
        {
            throw new Error("deviceId, email and password are mandatory");
            callback(errorStatus, request);
        }
        else if(request["deviceId"] == null ||
                request["email"] == null ||
                request["password"] == null)
        {
            throw new Error("deviceId, email and password can not be empty");
            callback(errorStatus, request);
        }
        else
        {
            callback(successStatus, request);
        }
    };
}
module.exports = RequestValidator;

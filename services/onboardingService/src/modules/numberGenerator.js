var MINUTE = 1000*60;
function NumberGenerator(logger) {
    this.generateRandomNumber = function(codeLength, callback) {
        var errorStatus = {
            "error": "Code generation failed",
            "message":"Internal error occurred"
        }
        try
        {
            var number = Math.pow(10, (codeLength - 1));
            var code = 
                Math.floor(Math.random() * number * 9) + number;
            logger.log("info", "code: " + code);
            callback(null, {"activationCode": code});
        }
        catch(err)
        {
            logger.log("error", "[ERROR] " + err.message);
            logger.log("error", "[ERROR] " + err.stack);
            errorStatus["message"] = err.message
            callback(errorStatus, null);
        }
    }
    this.getExpiryTime = function(expiryPeriod) {
        currentTime = new Date();
        logger.log("info", currentTime);
        currentTime.setTime(currentTime.getTime() + 1000*60*60);
        logger.log("info", currentTime);
        return currentTime;
    }
}
module.exports = NumberGenerator;
var ping = function(logger, constants) {
    var currentTime, response;
    return function(req, res, next)
    {
        try {
            currentTime = new Date();
            logger.log("info", "received ping request at " + currentTime);
            message = "Server is up and running at " + currentTime;
            res.send(
                {
                    "status": message
                }
            );
        } 
        catch (err) {
            logger.log("error", err.message);
            logger.log("error", err.stack);
            res.send(
                {
                    "status": "FAILED"
                }   
            );
        }
    }
}
exports.get = ping;
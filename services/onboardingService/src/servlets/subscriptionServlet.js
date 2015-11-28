var login = function(logger, requestValidator) {
    var request, decodedBody;
    return function(req, res, next)
    {
        try {
            decodedBody = decodeURIComponent(req.body);
            logger.info("got:" + decodedBody);
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
}
exports.post = login;

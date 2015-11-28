var details = function(logger, constants, userHelper, config) {
    return function(req, res, next)
    {
        var filter = {};
        try {
            request = req.query;
            logger.log("info", request);
            if (request != null && request != undefined) {
                if (request.hasOwnProperty("clientId") && request.clientId !== "" )
                {
                    filter.clientId = request.clientId;
                }
                if (request.hasOwnProperty("userId") && request.userId !== "" )
                {
                    filter.userId = request.userId;
                }
            }
            if (filter == {})
            {
                res.send({
                    "status": "ERROR",
                    "error": "Required Parameter: userId or clientId"
                });
            }
            userHelper.getUser(filter, function (err, details) {
                if (err === null) {
                    res.send(
                        {
                            "status": "SUCCESS",
                            "message": err,
                            "details": details
                        }
                    );
                }
                else {
                    res.send({
                        "status": "FAILED",
                        "message": err.message,
                        "details": {}
                    });
                }
            });
        }
        catch(err) {
            logger.log("error", err.message);
            logger.log("error", err.stack);
            res.send(
                {
                    "status": "FAILED",
                    "message": err.message,
                    "details": {}
                }   
            );
        }
    }
}

exports.get = details;

var errorHandler = function(err, req, res, next) {
    if (err)
    {
        res.send(500, {
            error: "Something Blew up",
            details: err.message
        });
    }
};

exports.errorHandler = errorHandler;
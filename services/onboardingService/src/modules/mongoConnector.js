var mongoose = require('mongoose'),
    fs = require('fs'),
    util = require('util');
/*
    This modules connects to mongo database. Gets path of config file.
    Reads this config file converts it to JSON and creates MONGO URI string.
    Connects to database and sends the response and error to callback function.
*/
function MongoConnector(logger) {
    function connect(config, callback) {
        console.log("reading =" + config);
        fs.readFile(config, function (err, data) { 
            var mongoConfig = JSON.parse(data);
            var url = mongoConfig["url"];
            var database = mongoConfig["database"];
            var userName = mongoConfig["user"];
            var password = mongoConfig["pass"];
            var uristring = "mongodb://"+ userName + ":" + password + 
                            "@" + url + "/" + database;
            var opts = mongoConfig["opts"];
            logger.log(uristring);
            logger.log(JSON.stringify(opts));
            
            var db = mongoose.connect(uristring ,opts, function (err, res) {
                if (err) {
                    logger.log(
                        'error',
                        'Error con]necting to: ' + 
                        uristring + 
                        '. ' +
                        err
                    );
                    callback("CONNECTION_FAILED", null);
                    throw new Error('Database connection failed.');
                } 
                else {
                    logger.log(
                        'info', 
                        'Successfull connection established with ' +
                        'mongoDb.'
                    );
                    callback(null, mongoose);
                }
            });
            this.connection = mongoose;
        });
    }
    this.connect = connect;
}
module.exports = MongoConnector;

var getFileLogger = function(expressLogger, logFilePath) {
    var fs = require('fs'),
    writeStream = 
        fs.createWriteStream(
            logFilePath, 
            { 
                flags: 'a',
                encoding: null,
                mode: 0666 
            }
        );
    return expressLogger({stream: writeStream});
};

exports.getFileLogger = getFileLogger;


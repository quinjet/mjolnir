exports.createServer = function (serverTypeName, port) {
    server = require('../servers/' + serverTypeName + '.js')
    server.start(port);
}

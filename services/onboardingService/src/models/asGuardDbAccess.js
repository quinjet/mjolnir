function asGuard() {
    
}
asGuard.prototype.setConnection = function(connection) {
    asGuard.prototype.connection = connection;
    asGuard.prototype.ObjectId = require('mongoose').Types.ObjectId;
}
module.exports = asGuard;
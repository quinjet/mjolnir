var asGuardDbAccessor = require("./asGuardDbAccess.js"),
    util = require('util');
    logger = require('winston');

function Configuration() {
    logger.info("initing configutation");
    var COLLECTION_NAME = "configurations";
    var paymentOption =
        new asGuardDbAccessor.prototype.connection.Schema(
            {
                "name": {
                    type: String,
                    required: true,
                    trim: true
                },
                "type" : {
                    type: String,
                    required: true,
                    trim: true
                },
                "isActive": {
                    type: Boolean,
                    required: true,
                    trim: true
                },
                "context": {
                    type: String,
                    required: true,
                    trim: true
                },
                "_id": false
            }
        );

    
    var configurationSchema = {
        "email": {
            type: String,
            required: true,
            trim: true
        },
        "domainName": {
            type: String,
            required: true,
            trim: true
        },
        "phone": {
            type: String,
            required: true,
            trim: true
        },
        "currency": {
            type: String,
            required: true,
            trim: true
        },
        "appKey": {
            type: String,
            required: false,
            trim: true
        },
        "appSecret": {
            type: String,
            required: false,
            trim: true
        },
        "salt": {
            type: String,
            required: false,
            trim: true
        },
        "currency" : {
            type: String,
            required: true,
            trim: true
        },
        "paymentOptions": [paymentOption],
    };

    var ConfigurationModel = asGuardDbAccessor.prototype.connection.model(
                                 COLLECTION_NAME, configurationSchema
                             );

    this.saveToDb = function (request, callBack) {
        var keys = Object.keys(request);
        var doc = {};

        for(var i = 0; i < keys.length; i++) {
            doc[keys[i]] = request[keys[i]];
        }

        var toSave = new ConfigurationModel(doc);
        toSave.save(function (err, savedResponse, numberAffected) {
            var error = null;
            if (err) {
                util.log("[ERROR] err: " + err)
                if (err["name"] == "ValidationError") {
                    error = err.message;
                } else {
                    error = "Internal error while saving.";
                }
                toSave.set("status", "FAILED", {
                    strict: false
                });
                toSave.set("error", error, {
                    strict: false
                });
                callBack("[ERROR] Error while saving in DB.", null);
            } else {
                savedResponse.set("status", "SUCCESS", {
                    strict: false
                });
            }
            callBack(null, savedResponse == undefined ? toSave : savedResponse);
        });
    }

    this.updateToDb = function(selectionObj, updateObj, callback) {
        ConfigurationModel.find(selectionObj, function (err, doc) {
            if (err) {
                util.log( "[ERROR]" + err.message);
                callback(err.message, null);
            } else {
                ConfigurationModel.update(selectionObj, {
                    $set: updateObj
                }, function (err, doc) {
                    if (err) {
                        util.log( "[ERROR]" + err.message);
                        callback(err.message, null);
                    }else {
                        util.log("[INFO] Document Updated");
                        callback(null,doc);
                    }
                });
            }
        });
    }

    this.getFromDb = function(selectionObj, callback) {
        util.log("[INFO] getFromDb");
        ConfigurationModel.find(selectionObj, function (err, doc) {
            if (err) {
                util.log("[ERROR] getFromDb: " + err.message);
                callback(err.message, null);
            }
            else {
                util.log("[INFO] getFromDb successful: " + JSON.stringify(doc));
                callback(null, doc);
            }
        });
    }
    this.ConfigurationModel = ConfigurationModel;
}
util.inherits(Configuration, asGuardDbAccessor);
module.exports = Configuration;

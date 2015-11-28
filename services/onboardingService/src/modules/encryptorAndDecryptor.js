var crypto = require('crypto');

function EncryptorAndDecryptor() {
    var ALGORITHM = 'aes-256-ctr';

    this.encrypt = function (password, email, callBack) {
        var salt = new Date().getTime() + "_" +
            Math.round(Math.random() * 10000000000);
        var cipher = crypto.createCipher(ALGORITHM, salt);
        var crypted = cipher.update(password, 'utf8', 'hex');
        crypted += cipher.final('hex');
        var md5sum = crypto.createHash('md5');
        md5sum.update(email + "_" + salt);
        emailHash = md5sum.digest('hex');
        callBack(null, {
            "encryptedPassword": crypted,
            "salt": salt,
            "emailHash": emailHash
        });
    };

    this.decrypt = function (details, callBack) {
        if(details && details['salt'] && details['password']) {
            var decipher = crypto.createDecipher(ALGORITHM, details["salt"])
            var dec = decipher.update(details["password"], 'hex', 'utf8')
            dec += decipher.final('utf8');
            callBack(null, dec);
        }
        else{
            callBack({'error':'DECRYPTION FAILED',
                      'message':'REQUIRED VALUES NOT PRESENT'},null);
        }
    };
}
module.exports = EncryptorAndDecryptor;
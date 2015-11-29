var http = require('https');
var util = require('util');

function OauthServiceCommunicator()
{
    function get(host, path, headers, callBack) {
        var seviceResponse = "";
        var optionsget = {
            host : host,
            path : path,
            headers: headers,
            method : 'GET',
        };
        console.log(optionsget);

        var reqGet = http.request(optionsget, function(res) {
            try {
                res.on('data', function(d) {
                    try {
                        seviceResponse += d;
                    } catch(e) {
                        util.error(e.message);
                        callBack("Internal error occured", null);
                    }
                }).on('end', function() {
                    try {
                        var response = JSON.parse(seviceResponse);
                        callBack(null, response);
                    } catch(e) {
                        callBack(e, null);
                    }
                }).on('error', function(e) {
                    util.error(e);
                    callBack(e.message, []);
                }); 
            } catch(e) {
                util.error(e);
                callBack("Internal error occured", []);
            }
        });

        reqGet.end();

        reqGet.on('error', function(e) {
            util.error(e)
            callBack(e.message, []);
        });
    }

    function post(host, path, jsonData, callBack) {
        var response = "";
        var data = JSON.stringify(jsonData);
        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        };
        var options = {
            host : host,
            path : path,
            method : 'POST',
            headers : headers
        };
        var request = http.request(options, function(res) {
            var response = "";
            try {
                res.on('data', function(d) {
                    try {
                        response += d;
                    }
                    catch(e) {
                        util.log(e.message);
                        callBack("Internal error occured", []);
                    }
                }).on('end', function() {
                    if(response === 'string') {
                        response = JSON.parse(response);
                    }
                    callBack(null, response);
                }).on('error', function(e) {
                    util.log(e.message)
                    callBack(e.message, []);
                });
            } catch(e) {
                util.log(e.message);
                callBack("Internal error occured", []);
            }
        });
        
        request._headerSent = true;
        request.write(data);
        request.end();

        request.on('error', function(e) {
            util.log(e.message)
            callBack(e.message, []);
        });
    }

    function getAuthToken(callback) {

        var request = {
            'application_key': APPLICATION_KEY,
            'application': APP_NAME
        };
        get(SERVICES, HADES_CONTEXT_HOST + '?jsonQuery=' + JSON.stringify(request),
            function(err, response) {
                if(err) {
                    callback("Error while getting access token = " + err.message, null);
                } else {
                    if(response.exception === null) {
                        callback(null, response.context);
                    } else {
                        callback("Exception from hades service = " + JSON.stringify(response.exception), null);
                    }
                }
            }
        );
    }

    this.get = get;
    this.post = post;
    this.getAuthToken = getAuthToken;
}

module.exports = OauthServiceCommunicator;


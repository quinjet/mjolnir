/**
 * Created by vivek.patel on 29/11/15.
 */
function ajaxCall(type, url, data, callback) {
    $.ajax({
            type: type,
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            error: function (xhr) {
                callback(null, xhr);
            },
            success: function (response) {
                callback(response, null);
            }
        }
    );
};

$(document).ready(function() {
    if(sessionStorage.getItem("paypal") === "true") {
        $("#reconnectPaypal").removeClass("fa btn btn-danger fa-chain");
        $("#reconnectPaypal").addClass("fa btn btn-success fa-chain");
        $("#doneButton").removeClass("disabled");
        $("#connectPaypal").html("Connected ");
    }

    $('#connectAmazon').click(function() {
        var success = false;
        if(sessionStorage.getItem("appKey")) {
            success = true;
        }
        if(success){
            var userName = null;
            var passwd = null;
            var apiKey = null;
            var currencyUpdateRequest = {
                "appKey" : sessionStorage.getItem("appKey"),
                "paymentOptions": [
                    {
                        "name": "Amazon",
                        "isActive": "true",
                        "type": "wallet",
                        "context": {
                            "userName": userName,
                            "password": passwd,
                            "apiKey": apiKey
                        }
                    }
                ]
            }

            ajaxCall("POST", "/onboardingService/subscribe", JSON.stringify(currencyUpdateRequest),
                function(res, err){
                    console.log(JSON.stringify(res));
                    if(err){

                    }
                    else {
                        sessionStorage.setItem("appKey", res.merchant.appKey);
                        sessionStorage.setItem("storeUrl", res.merchant.domainName);
                        sessionStorage.setItem("appSecret", res.merchant.appSecret);
                        $("#reconnectAmazon").removeClass("fa btn btn-danger fa-chain");
                        $("#reconnectAmazon").addClass("fa btn btn-success fa-chain");
                        $("#doneButton").removeClass("disabled");
                        $("#connectPaypal").html("Connected ");
                    }
                }
            );
        }
    });
});
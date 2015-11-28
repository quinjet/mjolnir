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
    $("#userPublicKey").val(sessionStorage.getItem("appKey"));

    var currency = {
        "INR" : "Indian Ruppee INR",
        "USD" : "United States dollar USD",
        "EUR" : "Euro EUR",
        "GBP" : "Pound GBP"
    };
    ajaxCall("GET", "/onboardingService/merchantDetail?appKey=" + sessionStorage.getItem("appKey"), null,
        function(res, err){
            console.log(JSON.stringify(res));
            if(err){

            }
            else {
                sessionStorage.setItem("appKey", res.merchant.appKey);
                sessionStorage.setItem("storeUrl", res.merchant.domainName);
                sessionStorage.setItem("appSecret", res.merchant.appSecret);

                $("#userSecretKey").val(res.merchant.appSecret);
                $("#userStoreUrl").val(res.merchant.domainName);
                $("#userCurrency").val(currency[res.merchant.currency]);

                var platformsStr = [];
                var index = 0;
                for(platform in res.merchant.platforms) {
                    platformsStr[index++] = platform.name;
                }
                $("#userPlatform").val(platformsStr.join(" , "));
                $("#doneButton").removeClass("disabled");
            }
        }
    );
});
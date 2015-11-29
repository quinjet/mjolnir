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
    $("#signInButton").click(function() {
        var currencyUpdateRequest = {
            "appKey" : sessionStorage.getItem("appKey"),
            "paymentOptions": [
                {
                    "name": "Paypal",
                    "isActive": "true",
                    "type": "wallet",
                    "context": {
                        "username": $("#inputMail").val(),
                        "password": $("#inputPassword").val(),
                        "signature": $("#inputSign").val(),
                        "merchantId": $("#inputMerchantId").val()
                    }
                }
            ]
        }

        ajaxCall("POST", "/onboardingService/subscribe", JSON.stringify(currencyUpdateRequest),
            function(res, err){
                console.log(JSON.stringify(res));
                if(err){
                    sessionStorage.setItem("paypal", false);
                }
                else {
                    sessionStorage.setItem("appKey", res.merchant.appKey);
                    sessionStorage.setItem("storeUrl", res.merchant.domainName);
                    sessionStorage.setItem("appSecret", res.merchant.appSecret);
                    sessionStorage.setItem("paypal", true);
                    $("#reconnectPaypal").removeClass("fa btn btn-danger fa-chain");
                    $("#reconnectPaypal").addClass("fa btn btn-success fa-chain");
                    $("#doneButton").removeClass("disabled");

                    window.location.href = "../merchant.html";
                }
            }
        );
    });
});
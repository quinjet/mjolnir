/**
 * Created by vivek.patel on 28/11/15.
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
    $("#storeUrl").val(sessionStorage.getItem("storeUrl"));
    if($("#storeUrl").val() !== "") {
        $("#storeUrl").addClass("disabled");
    }

    $('#storePlatform').on('change', function() {
        var selectedShop = $("#storePlatform option:selected").text();
        var info = null;
        switch (selectedShop){
            case "Others":
                info = "";
                break;

            case "Shopify":
                info = "We already have an app on " + selectedShop +
                       ". Click here to download app on " + selectedShop + " : " + "<a href='https://apps.shopify.com/quinjet' target='_blank'> <b>Quinjet</b></a><br>";
                break;

            default :
                info = "We already have QuinJet app on " + selectedShop + " , so please install and" +
                       " run the app once, then click verify button.<br>"
                break;
        }
        $("#selectedShopInfo").empty();
        $("#selectedShopInfo").append(info);
    });

    $('#storeAuthButton').click(function() {
        var success = false;
        if(sessionStorage.getItem("appKey")) {
            success = true;
        }

        var platformSaveDataRequest = {
            "appKey": sessionStorage.getItem("appKey"),
            "platforms": [
                {
                    "name": $("#storePlatform option:selected").text(),
                    "context": {
                        "test1": "test1",
                        "test2": "test2"
                    }
                }
            ]
        };

        if(success){
            ajaxCall("POST", "/onboardingService/subscribe", JSON.stringify(platformSaveDataRequest),
                function(res, err){
                    console.log(JSON.stringify(res));
                    if(err){

                    }
                    else {
                        $("#currencyForm").removeClass("hidden");
                    }
                }
            );
        }
    });

    $('#storeSaveButton').click(function() {
        var success = false;
        if(sessionStorage.getItem("appKey")) {
            success = true;
        }
        if(success){
            var currencyUpdateRequest = {
                appKey : sessionStorage.getItem("appKey"),
                currency : $("#storeCurrency").val(),
                webhookUrl : $("#storeWebhook").val()
            }

            if(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.
                    test(currencyUpdateRequest.webhookUrl)){
                ajaxCall("POST", "/onboardingService/subscribe", JSON.stringify(currencyUpdateRequest),
                    function(res, err){
                        console.log(JSON.stringify(res));
                        if(err){

                        }
                        else {
                            sessionStorage.setItem("appKey", res.merchant.appKey);
                            sessionStorage.setItem("storeUrl", res.merchant.domainName);
                            window.location.href = "../merchant.html";
                        }
                    }
                );
            } else {
                alert("webhook url is not valid.");
            }
        }
    });
});
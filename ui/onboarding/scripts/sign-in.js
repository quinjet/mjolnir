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
    $(".signInButton").click(function() {
        ajaxCall("GET", "/onboardingService/merchantDetail?email=" + $("#userMail").val(), null, function(res, err){
            console.log(res);
            if(err){

            }
            else {
                sessionStorage.setItem("appKey", res.merchant.appKey);
                window.location.href = "../dashboard.html";
            }
        });
    });
});
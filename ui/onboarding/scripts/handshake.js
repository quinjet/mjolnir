/**
 * Created by vivek.patel on 28/11/15.
 */
$(document).ready(function() {
    $('#storePlatform').on('change', function() {
        var selectedShop = $("#storePlatform option:selected").text();
        var info = null;
        switch (selectedShop){
            case "Others":
                info = "";
                break;

            case "Shopify":
                info = "We already have an QuinJet app on " + selectedShop + " , so please install and" +
                       " run the app once, then click verify button. <br>" +
                       "Click here to download app on " + selectedShop + " : " + "URL<br>";
                break;

            default :
                info = "We already have an QuinJet app on " + selectedShop + " , so please install and" +
                       " run the app once, then click verify button.<br>"
                break;
        }
        $("#selectedShopInfo").empty();
        $("#selectedShopInfo").append(info);
    });

    $('#about').click(function() {
        $(".model-button").removeClass("btn-dark");
        $(".model-button").addClass("btn-info");
        $("#eWallet").removeClass("btn-info");
        $("#eWallet").addClass("btn-dark");

        $(".app-button").addClass("hidden");
        $("#walletHtml").removeClass("hidden");
        showWalletOptions();
    });
});
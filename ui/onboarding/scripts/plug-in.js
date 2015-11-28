/**
 * Created by vivek.patel on 28/11/15.
 */
var bankList =
    [
        "Allahabad Bank",
        "Andhra Bank",
        "Axis Bank",
        "Bank of Bahrain and Kuwait",
        "Bank of Baroda - Corporate Banking",
        "Bank of Baroda - Retail Banking",
        "Bank of India",
        "Bank of Maharashtra",
        "Canara Bank",
        "Central Bank of India",
        "City Union Bank",
        "Corporation Bank",
        "Deutsche Bank",
        "Development Credit Bank",
        "Dhanlaxmi Bank",
        "Federal Bank",
        "HDFC Bank",
        "ICICI Bank",
        "IDBI Bank",
        "Indian Bank",
        "Indian Overseas Bank",
        "IndusInd Bank",
        "ING Vysya Bank",
        "Jammu and Kashmir Bank",
        "Karnataka Bank Ltd",
        "Karur Vysya Bank",
        "Kotak Bank",
        "Laxmi Vilas Bank",
        "Oriental Bank of Commerce",
        "Punjab National Bank - Corporate Banking",
        "Punjab National Bank - Retail Banking",
        "Punjab & Sind Bank",
        "Shamrao Vitthal Co-operative Bank",
        "South Indian Bank",
        "State Bank of Bikaner & Jaipur",
        "State Bank of Hyderabad",
        "State Bank of India",
        "State Bank of Mysore",
        "State Bank of Patiala",
        "State Bank of Travancore",
        "Syndicate Bank",
        "Tamilnad Mercantile Bank Ltd.",
        "UCO Bank",
        "Union Bank of India",
        "United Bank of India",
        "Vijaya Bank",
        "Yes Bank Ltd"
    ];

function showCardOptions(s) {
    var year = new Date().getFullYear();
    if($('#expiryYear').size() === 1){
        for(var i = year ; i <= year + 25 ; i++)
        {
            $('#expiryYear').append($('<option>', {
                value: i,
                text : i
            }));
        }
    }

    switch(s){
        case "CREDIT":
            $("#selectedCard").text("Credit Card Details");
            break;

        case "DEBIT":
            $("#selectedCard").text("Debit Card Details");
            break;
    }
}

function showBankingOption() {
    if($('#bankList').  size() === 1) {
        $.each(bankList, function (i, item) {
            $('#bankList').append($('<option>', {
                value: item,
                text: item
            }));
        });
    }
}
function showWalletOptions() {
    var stubForWallet = [
        {
            merchant: "PAYTM",
            url: "http://paytm.com"
        },
        {
            merchant: "AMAZON",
            url: "http://amazon.com"
        }
    ]

    $.each(stubForWallet, function (i, info) {
        console.log(info);
        $('#merchantList').append($('<option>', {
            value: JSON.stringify(info),
            text : info.merchant
        }));
    });

    $("#walletOk").click(function() {
        var selectedMerchant = $("#merchantList").val();
        if(selectedMerchant){
            var merchantInfo = JSON.parse(selectedMerchant);
            window.location.href = merchantInfo.url;
        }
    });
}

$(document).ready(function() {
    $('#eWallet').click(function() {
        $(".model-button").removeClass("btn-dark");
        $(".model-button").addClass("btn-info");
        $("#eWallet").removeClass("btn-info");
        $("#eWallet").addClass("btn-dark");

        $(".app-button").addClass("hidden");
        $("#walletHtml").removeClass("hidden");
        showWalletOptions();
    });

    $('#creditCard').click(function() {
        $(".model-button").removeClass("btn-dark");
        $(".model-button").addClass("btn-info");
        $("#creditCard").removeClass("btn-info");
        $("#creditCard").addClass("btn-dark");

        $(".app-button").addClass("hidden");
        $("#cardsDetailsHtml").removeClass("hidden");
        showCardOptions("CREDIT");
    });

    $('#debitCard').click(function() {
        $(".model-button").removeClass("btn-dark");
        $(".model-button").addClass("btn-info");
        $("#debitCard").removeClass("btn-info");
        $("#debitCard").addClass("btn-dark");

        $(".app-button").addClass("hidden");
        $("#cardsDetailsHtml").removeClass("hidden");
        showCardOptions("DEBIT");
    });

    $('#banking').click(function() {
        $(".model-button").removeClass("btn-dark");
        $(".model-button").addClass("btn-info");
        $("#banking").removeClass("btn-info");
        $("#banking").addClass("btn-dark");

        $(".app-button").addClass("hidden");
        $("#bankingHtml").removeClass("hidden");
        showBankingOption();
    });
});
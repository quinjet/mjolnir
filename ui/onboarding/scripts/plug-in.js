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
function detectCardType(number) {
    var re = {
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        dankort: /^(5019)\d+$/,
        interpayment: /^(636)\d+$/,
        unionpay: /^(62|88)\d+$/,
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };
    if (re.electron.test(number)) {
        return 'ELECTRON';
    } else if (re.maestro.test(number)) {
        return 'MAESTRO';
    } else if (re.dankort.test(number)) {
        return 'DANKORT';
    } else if (re.interpayment.test(number)) {
        return 'INTERPAYMENT';
    } else if (re.unionpay.test(number)) {
        return 'UNIONPAY';
    } else if (re.visa.test(number)) {
        return 'VISA';
    } else if (re.mastercard.test(number)) {
        return 'MASTERCARD';
    } else if (re.amex.test(number)) {
        return 'AMEX';
    } else if (re.diners.test(number)) {
        return 'DINERS';
    } else if (re.discover.test(number)) {
        return 'DISCOVER';
    } else if (re.jcb.test(number)) {
        return 'JCB';
    } else {
        return undefined;
    }
};
var initialized = false;
var merchantData = {};
var paypalLink = 'https://www.sandbox.paypal.com/checkoutnow?token='
var bankList =
    [
        'Allahabad Bank',
        'Andhra Bank',
        'Axis Bank',
        'Bank of Bahrain and Kuwait',
        'Bank of Baroda - Corporate Banking',
        'Bank of Baroda - Retail Banking',
        'Bank of India',
        'Bank of Maharashtra',
        'Canara Bank',
        'Central Bank of India',
        'City Union Bank',
        'Corporation Bank',
        'Deutsche Bank',
        'Development Credit Bank',
        'Dhanlaxmi Bank',
        'Federal Bank',
        'HDFC Bank',
        'ICICI Bank',
        'IDBI Bank',
        'Indian Bank',
        'Indian Overseas Bank',
        'IndusInd Bank',
        'ING Vysya Bank',
        'Jammu and Kashmir Bank',
        'Karnataka Bank Ltd',
        'Karur Vysya Bank',
        'Kotak Bank',
        'Laxmi Vilas Bank',
        'Oriental Bank of Commerce',
        'Punjab National Bank - Corporate Banking',
        'Punjab National Bank - Retail Banking',
        'Punjab & Sind Bank',
        'Shamrao Vitthal Co-operative Bank',
        'South Indian Bank',
        'State Bank of Bikaner & Jaipur',
        'State Bank of Hyderabad',
        'State Bank of India',
        'State Bank of Mysore',
        'State Bank of Patiala',
        'State Bank of Travancore',
        'Syndicate Bank',
        'Tamilnad Mercantile Bank Ltd.',
        'UCO Bank',
        'Union Bank of India',
        'United Bank of India',
        'Vijaya Bank',
        'Yes Bank Ltd'
    ];

function init(appKey, checksum, transactionId, amount) {
    merchantData.appKey = appKey;
    merchantData.checksum = checksum;
    merchantData.transactionId = transactionId;
    merchantData.amount = amount;
}
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
        case 'CREDIT':
            $('#selectedCard').text('Credit Card Details');
            break;

        case 'DEBIT':
            $('#selectedCard').text('Debit Card Details');
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
    $('#merchantList').empty();
    var stubForWallet = [
        {
            merchant: 'PayPal',
            url: 'http://paytm.com'
        },
        {
            merchant: 'AMAZON',
            url: 'http://amazon.com'
        }
    ]

    $.each(stubForWallet, function (i, info) {
        console.log(info);
        $('#merchantList').append($('<option>', {
            value: JSON.stringify(info),
            text : info.merchant
        }));
    });

    var selectedMerchant = JSON.parse($('#merchantList').val()).merchant;
    if(selectedMerchant === 'Paypal' || selectedMerchant === 'PayPal') {
        $('#selectedWalletInfo').addClass('hidden');
        $('#paypalWalletInfo').removeClass('hidden');
        paypal.checkout.setup('HPHXUYLPAULHQ', {
            environment: 'sandbox',
            container: ['paypalWalletInfo'],
            click: function () {
                paypal.checkout.initXO();
                var data = {
                    'paymentType' : 'ewallet',
                    'paymentMethod' : 'paypal',
                    'appKey' : merchantData.appKey,
                    'transactionId' : merchantData.transactionId,
                    'amount' : merchantData.amount,
                    'callbackUrl' : window.location.href
                }
                var action = $.post('/transactionService/payment', JSON.stringify(data));
                action.done(function (data) {
                    paypal.checkout.startFlow(data.token);
                });

                action.fail(function () {
                    paypal.checkout.closeFlow();
                });
            }
        });
    }
    else {
        $('#paypalWalletInfo').addClass('hidden');
        $('#selectedWalletInfo').removeClass('hidden');
    }

    $('#merchantList').on('change', function() {
        var selectedMerchant = JSON.parse(this.value).merchant;
        console.log(selectedMerchant);
        if(selectedMerchant === 'Paypal' || selectedMerchant === 'PayPal') {
            $('#selectedWalletInfo').addClass('hidden');
            $('#paypalWalletInfo').removeClass('hidden');
            paypal.checkout.setup('HPHXUYLPAULHQ', {
                environment: 'sandbox',
                container: ['paypalWalletInfo'],
                click: function () {
                    paypal.checkout.initXO();
                    var data = {
                        'paymentType' : 'ewallet',
                        'paymentMethod' : 'paypal',
                        'appKey' : merchantData.appKey,
                        'transactionId' : merchantData.transactionId,
                        'amount' : merchantData.amount,
                        'callbackUrl' : window.location.href
                    }
                    var action = $.post('/transactionService/payment', JSON.stringify(data));
                    action.done(function (data) {
                        paypal.checkout.startFlow(data.token);
                    });

                    action.fail(function () {
                        paypal.checkout.closeFlow();
                    });
                }
            });
        }
        else {
            $('#paypalWalletInfo').addClass('hidden');
            $('#selectedWalletInfo').removeClass('hidden');
        }
    });
}

$(document).ready(function() {
    var appKey = sessionStorage.getItem("appKey");
    //var ammount = $(".h1.cart-subtotal--price").text().trim().split(" ")[1].replace(/,/g, "");
    var ammount = new Date().getSeconds();
    init(appKey, '', new Date().toISOString(), ammount);

    $('#eWallet').click(function() {
        $('.model-button').removeClass('btn-dark');
        $('.model-button').addClass('btn-info');
        $('#eWallet').removeClass('btn-info');
        $('#eWallet').addClass('btn-dark');

        $('.app-button').addClass('hidden');
        $('#walletHtml').removeClass('hidden');
        showWalletOptions();
    });

    $('#creditCard').click(function() {
        $('.model-button').removeClass('btn-dark');
        $('.model-button').addClass('btn-info');
        $('#creditCard').removeClass('btn-info');
        $('#creditCard').addClass('btn-dark');

        $('.app-button').addClass('hidden');
        $('#cardsDetailsHtml').removeClass('hidden');
        showCardOptions('CREDIT');
    });

    $('#debitCard').click(function() {
        $('.model-button').removeClass('btn-dark');
        $('.model-button').addClass('btn-info');
        $('#debitCard').removeClass('btn-info');
        $('#debitCard').addClass('btn-dark');

        $('.app-button').addClass('hidden');
        $('#cardsDetailsHtml').removeClass('hidden');
        showCardOptions('DEBIT');
    });

    $('#banking').click(function() {
        $('.model-button').removeClass('btn-dark');
        $('.model-button').addClass('btn-info');
        $('#banking').removeClass('btn-info');
        $('#banking').addClass('btn-dark');

        $('.app-button').addClass('hidden');
        $('#bankingHtml').removeClass('hidden');
        showBankingOption();
    });
    $('#creditOk').click(function() {
        var cardNumber = $('#card-number').val(),
            cvv = $('#cvv').val(),
            expiryMonth = $('#expiryMonth').val(),
            expiryYear = $('#expiryYear').val(),
            name = $('#name').val();

        var data =
        {
            'paymentType': 'card',
            'paymentMethod': 'paypal_credit',
            'appKey': merchantData.appKey,
            'transactionId': merchantData.transactionId,
            'amount': merchantData.amount,
            'creditCard': {
            'number': cardNumber,
                'type': detectCardType(cardNumber).toLowerCase(),
                'expire_month': expiryMonth,
                'expire_year': expiryYear,
                'cvv2': cvv,
                'first_name': name,
                'last_name': name,
                'billing_address': {
                'line1': '111 First Street',
                    'city': 'Saratoga',
                    'state': 'CA',
                    'postal_code': '95070',
                    'country_code': 'US'
            }
        }
        }
        console.log('asd: ' + JSON.stringify(data));
        var action = $.post('/transactionService/payment', JSON.stringify(data));
        action.done(function (data) {
            console.log('Done : ' + JSON.stringify(data));
            alert("Payment sent successfully.");
        });
        action.fail(function () {
            console.log('failed');
            alert("Error while sending payment.");
        });
    })
    $(window).bind('hashchange', function() {
        console.log(window.location.hash);
        console.log(JSON.stringify(getUrlVars()));
        var params = getUrlVars();
        var data =
          { 'paymentType' : 'ewallet',
            'paymentMethod' : 'paypal',
            'appKey' : merchantData.appKey,
            'paymentToken' : params.token,
            'payerId' : params.PayerID
        }
        if (window.location.hash.indexOf('#success')) {
            var action = $.post('/transactionService/confirmPayment', JSON.stringify(data));
            action.done(function (data) {
                console.log('Done : ' + JSON.stringify(data));
                alert("Payment done successfully.");
                window.close();
            });
            action.fail(function () {
                console.log('failed');
                alert("Error while doing payment.");
                window.location.href = "../plug-in.html";
            });
        }
    });

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function(m,key,value) {
                vars[key] = value;
            });
        return vars;
    }

});
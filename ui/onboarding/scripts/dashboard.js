/**
 * Created by archit.garg on 28/11/15.
 */

 Date.prototype.formatDate = function() {
   var yyyy = this.getFullYear();
   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
   var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
   var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
   var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
   return "".concat(dd).concat("-").concat(mm).concat("-").concat(yyyy).concat(" ")
            .concat(hh).concat(":").concat(min).concat(":").concat(ss);
  };

function isValidObj(curObj)
{
    var valid = false;
    if(curObj["paymentMethod"] && curObj["amount"] &&
       curObj["amount"] != null && curObj["paymentType"])
    {
        valid = true;
    }
    return valid;
}

$(document).ready(function() {
    var PayMethodsEnum = {"paypal":"paypal", "paypal_credit":"paypal_credit", "paypal_debit":"paypal_debit"}
    var PayStatusEnum = {"Completed":"Completed", "Failed":"Failed"}
    var PayTypesEnum = {"ewallet":"ewallet", "card":"card"}

    var url = "/transactionService/transactions";
    var appKey = sessionStorage.getItem("appKey");
    var jsonData = $.ajax({
                        url: url,
                        dataType: "application/json",
                        data: "appKey="+appKey,
                        async: false
                    }).responseText;
    
    var cc_transactions = 0;
    var dc_transactions = 0;
    var paypal_transactions = 0;
    var completed_transactions = 0;
    var failed_transactions = 0;
    var amount_transactions = 0;

    var jsonDataObj = JSON.parse(jsonData);

        for (var index = 0; index < jsonDataObj["message"].length; index++)
    {
        var curObj = jsonDataObj["message"][index];
        jsonDataObj["message"][index]["required"] = false;
        if(isValidObj(curObj))
        {
            if(curObj["paymentType"] == PayTypesEnum.ewallet)
            {
                if(curObj["paymentMethod"] == PayMethodsEnum.paypal)
                {
                    if(!curObj["paymentStatus"] || curObj["paymentStatus"] == PayStatusEnum.Failed)
                    {
                        var amount = parseFloat(curObj["amount"]);
                        if (!isNaN(amount))
                        {
                            paypal_transactions = paypal_transactions + 1;
                            failed_transactions = failed_transactions + 1;
                            amount_transactions = amount_transactions + amount;
                            jsonDataObj["message"][index]["required"] = true;
                        }
                    }
                    else if(curObj["paymentStatus"] == PayStatusEnum.Completed)
                    {
                        var amount = parseFloat(curObj["amount"]);
                        if (!isNaN(amount))
                        {
                            paypal_transactions = paypal_transactions + 1;
                            completed_transactions = completed_transactions + 1;
                            amount_transactions = amount_transactions + amount;
                            jsonDataObj["message"][index]["required"] = true;
                        }
                    }
                }
            }
            else if(curObj["paymentType"] == PayTypesEnum.card)
            {
                if(curObj["paymentMethod"] == PayMethodsEnum.paypal_credit)
                {
                    if(!curObj["paymentStatus"] || curObj["paymentStatus"] == PayStatusEnum.Failed)
                    {
                        var amount = parseFloat(curObj["amount"]);
                        if (!isNaN(amount))
                        {
                            cc_transactions = cc_transactions + 1;
                            failed_transactions = failed_transactions + 1;
                            amount_transactions = amount_transactions + amount;
                            jsonDataObj["message"][index]["required"] = true;
                        }
                    }
                    else if(curObj["paymentStatus"] == PayStatusEnum.Completed)
                    {
                        var amount = parseFloat(curObj["amount"]);
                        if (!isNaN(amount))
                        {
                            cc_transactions = cc_transactions + 1;
                            completed_transactions = completed_transactions + 1;
                            amount_transactions = amount_transactions + amount;
                            jsonDataObj["message"][index]["required"] = true;
                        }
                    }
                }
                else if(curObj["paymentMethod"] == PayMethodsEnum.paypal_debit)
                {
                    if(!curObj["paymentStatus"] || curObj["paymentStatus"] == PayStatusEnum.Failed)
                    {
                        var amount = parseFloat(curObj["amount"]);
                        if (!isNaN(amount))
                        {
                            dc_transactions = dc_transactions + 1;
                            failed_transactions = failed_transactions + 1;
                            amount_transactions = amount_transactions + amount;
                            jsonDataObj["message"][index]["required"] = true;
                        }
                    }
                    else if(curObj["paymentStatus"] == PayStatusEnum.Completed)
                    {
                        var amount = parseFloat(curObj["amount"]);
                        if (!isNaN(amount))
                        {
                            dc_transactions = dc_transactions + 1;
                            completed_transactions = completed_transactions + 1;
                            amount_transactions = amount_transactions + amount;
                            jsonDataObj["message"][index]["required"] = true;
                        }
                    }
                }
            }
        }
    }

    $("#cc_transactions").html(cc_transactions);
    $("#dc_transactions").html(dc_transactions);
    $("#paypal_transactions").html(paypal_transactions);
    $("#completed_transactions").html(completed_transactions);
    $("#failed_transactions").html(failed_transactions);
    $("#amount_transactions").html(amount_transactions);

    
    // Transactions
    var transactionTable = $('#transaction_table').dataTable( {
        "aoColumns": [
            null, null, null,
            null, null, null
            ],
        "bAutoWidth": false,
      } ); 
    
    transactionTable.dataTable().fnClearTable();
    
    for(i = 0; i < jsonDataObj["message"].length; i++) {
        
        var curObj = jsonDataObj["message"][i];
        if(curObj["required"] == true)
        {
            var provider = "UNKNOWN";
            var paymentMethod = "UNKNOWN";
            var status = "UNKNOWN";
            var timestamp = curObj["_id"].toString().substring(0,8);
            date = new Date( parseInt( timestamp, 16 ) * 1000 );

            if (curObj["paymentMethod"] == PayMethodsEnum.paypal)
            {
                provider = PayMethodsEnum.paypal;
                paymentMethod = "paypal account";
            }
            else if (curObj["paymentMethod"] == PayMethodsEnum.paypal_credit)
            {
                provider = PayMethodsEnum.paypal;
                paymentMethod = "credit card";   
            }
            else if (curObj["paymentMethod"] == PayMethodsEnum.paypal_debit)
            {
                provider = PayMethodsEnum.paypal;
                paymentMethod = "debit card";
            }

            if (!curObj["paymentStatus"] || curObj["paymentStatus"] == PayStatusEnum.Failed)
            {
                status = PayStatusEnum.Failed;
            }
            else if(curObj["paymentStatus"] == PayStatusEnum.Completed)
            {
                status = PayStatusEnum.Completed;
            }

            provider = provider.toUpperCase();
            paymentMethod = paymentMethod.toUpperCase();
            status = status.toUpperCase();

            transactionTable.dataTable().fnAddData([
                date.formatDate(),
                curObj["transactionId"],
                provider,
                paymentMethod,
                curObj["amount"],
                status
            ]);
        }
    }
});
(function() {
    /*
     * key: value pair for validationType: corresponding regex.
     */
    var patterns = {
        "telephone": /^\+([0-9]{1,3})\-([0-9]{7,12})$/,
        "multiEmail": /^(([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})+\,(\s)?)*(([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4}))+$/,
        "singleEmail": /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "url":/^((http|https|ftp|ftps):\/\/)([a-z0-9\-]+\.)?([a-z0-9\-]+\.)+[a-z0-9]{2,12}(\.[a-z0-9]{2,12})?(\/[^\s]*)?$/,
        "displayUrl":/^([a-z0-9\-]+\.)?([a-z0-9\-]+\.)+[a-z0-9]{2,12}(\.[a-z0-9]{2,12})?(\/[^\s]*)?$/,
        "onlyLetters": /^[a-zA-Z ]*$/,
        "onlyNumbers": /^[0-9]+$/,
        "alphaNumeric" : /^[^%+]*$/,
        "adWordsClient" : /^([0-9]{10})+$/
    };

    /*
     * key: value pair for validationType: corresponding info/error message.
     */
    var messages = {
        "telephone": "Valid Number required eg. +91-9876543210",
        "singleEmail": "Invalid email address",
        "multiEmail": "Invalid email address, you can add multiple ',' separated addresses",
        "onlyLetters": "Only letters allowed",
        "onlyNumbers": "Only numbers allowed",
        "url": "Valid URL required eg.http://www.abc.com",
        "displayUrl": "eg. www.sokrati.com or support.sokrati.com. Display Url domain should be same as domain of Website Url",
        "alphaNumeric": "Enter Valid Name",
        "adWordsClient": "Enter valid id (Id only consists of numbers) eg. 5742635830",
    };

    var messageContainer =
        '<div class="reqformError formError">' +
          '<div class="formErrorContent">' +
          '</div>' +
        '</div>'

    /*
     * Valodator function.
     */
    var inputValidator = function() {
        var iGroup, iGrpElmnts, allIsWell = true, iGrpButtons;

        /*
         * Remove all messages on the page.
         */
        $('.reqformError').remove();

        /*
         * Get all elements within same group of current element.
         */
        iGroup = $(this).data("input-group");
        iGrpElmnts =
            $("input[type!='button']input[type!='submit'][data-input-group='" + iGroup + "']");
        /*
         * Get all buttons in current form.
         */
        iGrpButtons =
            $("input[type='button'][data-input-group='" + iGroup + "']");
        /*
         * Initially disable all buttons matching the group.
         */
        for(var j = 0; j < iGrpButtons.length; j += 1) {
            $(iGrpButtons[j]).attr("disabled", "disabled");
        }

        /*
         * Iterate over elements and check for its length.
         * If it is empty show required message,
         * else check for secondary validation.
         * If fails show the respective message and return.
         */
        for(var i = 0; i < iGrpElmnts.length; i += 1) {
            if(($(iGrpElmnts[i]).data("req-message") == null ||
                 $(iGrpElmnts[i]).data("req-message") == undefined) &&
                 !$(iGrpElmnts[i]).val()) {
                continue;
            }
             else if(!$(iGrpElmnts[i]).val()) {
                 /*
                  * If required check doesn't succeeds for any
                  * of the input element in the group show
                  * respective message and return.
                  */
                 allIsWell = false;
                 /*
                  * Calculate top and left of current element, to set error message.
                  */
                 if($(iGrpElmnts[i]).data("req-message") !== null &&
                     $(iGrpElmnts[i]).data("req-message") !== undefined) {
                    setMessage($(iGrpElmnts[i]), $(iGrpElmnts[i]).data("req-message"));
                 }
                 break;
             } else if($(iGrpElmnts[i]).data("secondary-check")) {
                 /*
                  * If required check succeeds for current
                  * input element in the group check for its secondary
                  * validation and if fails show
                  * respective message and return.
                  */
                 var secCheck = $(iGrpElmnts[i]).data("secondary-check");
                 if(!patterns[secCheck].test($(iGrpElmnts[i]).val())) {

                     /*
                      * Calculate top and left of current element, to set error message.
                      */
                     setMessage($(iGrpElmnts[i]), messages[secCheck]);
                     allIsWell = false;
                     break;
                 }
             }
        }

        /*
         * If allIsWell true enable subsmit button matching the group.
         */
        if(allIsWell) {
            /*
             * Initially disable all buttons matching the group.
             */
            for(var k = 0; k < iGrpButtons.length; k += 1) {
                $(iGrpButtons[k]).removeAttr("disabled");
            }
            return;
        }
        return;
    },



    /*
     * Calculate top and left of current element and set message.
     */
    setMessage = function(inputElm, message) {
        var p = $(inputElm).position();
        $(inputElm).after(messageContainer);
        $(".formErrorContent").html(message + "<br>");
        $(".reqformError").css({top: p.top, left: p.left + $(inputElm).width() + 20});
    },
    /*
     * Disable all buttons which data-disable-on-load is set to true.
     */
    disableSubmitButtonOnPageLoad = function() {
        var buttons = $("button");
        for(var i = 0; i < buttons.length; i += 1) {
            if($(buttons[i]).data("disable-on-load") === true) {
                $(buttons[i]).attr("disabled", "disabled");
            }
        }
    };

    $(document).ready(function() {
        /*
         * Initially submit botton will be disabled
         */
        //disableSubmitButtonOnPageLoad();
        $("body").on('keyup', 'input', inputValidator);
    });

})();

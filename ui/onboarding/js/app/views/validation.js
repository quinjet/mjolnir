define([
    'backbone'
], function (Backbone) {
    var ValidationView = Backbone.View.extend({
        setMessage: function(inputElm, message) {
            var messageContainer =
                '<div class="reqformError formError" style="opacity: 0.87; position: absolute;">' +
                  '<div class="formErrorContent">' +
                  '</div>' +
                '</div>'
            var p = $(inputElm).position();
            $(inputElm).after(messageContainer);
            $(".formErrorContent").html(message + "<br>");
            $(".reqformError").css({top: p.top, left: p.left + $(inputElm).width() + 20});
        },
        showMessage: function(element, type, msg) {
            html = '<div class="alert alert-' + type + ' fade" role="alert">';
            html += '<button type="button" class="close" data-dismiss="alert">×</button>';
            html += msg;
            html += '</div>';
            $(element).html(html);
            $(".alert").delay(200).addClass("in").fadeOut(6000);
        },
        removeMessage: function(){
            $('.alert').remove();
        },
        showPopUpMessage: function(type, msg) {
            if(type === "error") {
                type = "danger";
            }
            var element = "#notification",
            errorStyle =
                "display: none;background-color: #f2dede;border-color: #eed3d7;height: 38px;" +
                "margin-top: 7px; margin-left: 403px; width: 500px",
            successStyle =
                "display: none;background-color: #dff0d8;border-color: #d6e9c6;height: 38px;" +
                "margin-top: 7px; margin-left: 403px; width: 500px",
            html = '<div class="alert alert-' + type + '" role="alert" style="text-align: center;margin-top: -5px;font-size: inherit;">';
            $(element).addClass("modal");
            if(type === "success") {
                $(element).attr("style", successStyle);
            } else {
                $(element).attr("style", errorStyle);
            }
            html += msg;
            html += '</div>';
            $(element).html(html);
            $(element).show("fast");
            $(element).delay(5000).fadeOut(1000);
        },
        getAllParameters: function() {
            var urlParams, match,
            plus     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(plus, " "));
            },
            query  = window.location.search.substring(1);

            urlParams = {};
            while (match = search.exec(query)) {
               urlParams[decode(match[1])] = decode(match[2]);
            }
            return urlParams;
        },
        markTagInactive: function()
        {
            var urlParmas = this.getAllParameters();
            if(urlParmas.launcher == "review")
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    });
    return new ValidationView();
});

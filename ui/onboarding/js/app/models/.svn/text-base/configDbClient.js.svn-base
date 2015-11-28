define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/validation',
    'app/models/authCheck'
    ],
    function ($, _, Backbone, Validation, AuthCheck) {
    var ConfigDbClientModel = Backbone.Model.extend({
        defaults: {
            clients: []
        },
        urlRoot: "http://" + window.location.hostname + "/smblauncher/" +
                 "client_configuration/get_client_by_client_name?",
        initialize: function() {
            this.listenTo(this, "CHECK_CLIENT_NAME",
                          this.checkClientNameAvailability);
            this.deferred = new $.Deferred();
        },
        deferred: Function.constructor.prototype,
        fetchSuccess: function (collection, response, options) {
            collection.deferred.resolve();
            $("#image-tag-id").remove();
            var urlParam = Validation.getAllParameters();
            if(response.clients == null || response.clients == undefined ||
               response.clients == "" || response.clients.length <= 0) {
                $("#launchButton").removeAttr("disabled");
                $(".formErrorTemp").remove();
                $("#image-span").append(
                    "<img id='image-tag-correct' src='images/" +
                    "correct_sign.png'/>"
                );
            }
            else {
                options.self.setMessage(
                    "#businessName", "This client name already exists."
                );
                $("#launchButton").attr("disabled", "disabled");
            }
        },
        fetchError: function (collection, response) {
            AuthCheck.isAuthenticated(response);
            $("#image-tag-correct").remove();
            Validation.showPopUpMessage(
                "error", "Unable to check client name availability"
            );
        },
        setMessage: function(inputElm, message) {
            var messageContainer =
                '<div class="formErrorTemp">' +
                    '<div class="formErrorContentTemp">' +
                    '</div>' +
                '</div>';
            var p = $(inputElm).position();
            $(".formErrorTemp").remove();
            $(inputElm).after(messageContainer);
            $(".formErrorContentTemp").html(message + "<br>");
            $(".formErrorTemp").css({top: p.top, left: p.left +
                                   $(inputElm).width() + 20});
        },
        checkClientNameAvailability: function(enteredName) {
            $("#image-tag-id").remove();
            $("#image-tag-correct").remove();
            $("#image-span").append(
                "<img id='image-tag-id' src='images/ajax-loader.gif'/>"
            );
            var self = this;
            enteredName = enteredName.replace(/\t/g, " ").trim();
            this.url = this.urlRoot + "clientNameChosen=" + enteredName;
            this.fetch({
                self: self,
                success: this.fetchSuccess,
                error: this.fetchError,
                reset: true
            });
        }
    });
    return new ConfigDbClientModel();
});

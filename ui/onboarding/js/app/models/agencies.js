define([
    'backbone',
    'app/models/authCheck',
    'app/views/validation'
], function (Backbone, AuthCheck, Validation) {
    'use strict';
    var AgencyModel = Backbone.Model.extend({
        defaults: {
            agencies : [],
            selected_agency: null
        },
        initialize: function(){
            this.getAgencyList();
        },
        urlRoot: "http://" + window.location.hostname +
                 "/hadesV2/agencies",
        parse: function( data, xhr ) {
            return {
                agencies: data.agencies
            };
        },
        fetchError: function(model, response) {
            var error = "";
            if(response["error"] != null && response["error"] != "" &&
               response["error"] != undefined) {
                error = response["error"];
            }
            else {
                error = "Error occured while loading.";
            }
            AuthCheck.isAuthenticated(response);
            Validation.showPopUpMessage("error", error);
        },
        fetchComplete: function(object, status) {
            if(status == "error") {
                Validation.showPopUpMessage(
                    "error", "Error occured while loading."
                );
                 AuthCheck.isAuthenticated(object);
            }
        },
        getAgencyList: function() {
            this.url = "http://" + window.location.hostname +
                       "/hadesV2/agencies";
            this.fetch({
                error: this.fetchError,
                complete: this.fetchComplete
            });
        }
    });
    return new AgencyModel();
});

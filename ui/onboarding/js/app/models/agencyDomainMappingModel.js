define([
    'underscore',
    'backbone',
    'app/views/validation'
], function (_, Backbone, Validation) {
    'use strict';
    var AgencyDomainConfigurations = Backbone.Model.extend({
        defaults: {
            domain_url:null,
            logo_url:null,
            id:null,
            agency_id:null,
            currency_code:null,
            header:null,
            footer:null,
            timezone_id:null,
            review_mode: false,
            show_review: false,
            sandbox_cluster_id: null
        },
        initialize: function(){
            this.getDomainInfo();
        },
        fetchSuccess: function (model, response, options) {
            if(response == null && response == undefined) {
                Validation.showPopUpMessage(
                    "error", "Error while loading."
                );
            }
            options.self.trigger("AGENCY_DOMAIN_MODEL_FETCHED");
        },
        fetchError: function(model, response) {
            var error = "";
            if(response["error"] != null && response["error"] != "" &&
               response["error"] != undefined) {
                error = response["error"];
            }
            else {
                error = "Error while loading.";
            }
            Validation.showPopUpMessage("error", error);
        },
        fetchComplete: function(object, status) {
            if(status == "error") {
                Validation.showPopUpMessage(
                    "error", "Error occured while loading."
                );
            }
        },
        getDomainInfo: function() {
            var domainURL = window.location.hostname;
            this.url = "http://" + window.location.hostname + "/smblauncher/" +
                       "agency_domain_configurations/get_configurations?" +
                       "domainURL=" + domainURL;
            var self = this;
            this.fetch({
                self : self,
                success: this.fetchSuccess,
                error: this.fetchError,
                complete: this.fetchComplete
            });
        }
    });
    return new AgencyDomainConfigurations();
});

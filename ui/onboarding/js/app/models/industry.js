define([
    'underscore',
    'backbone',
    'app/models/agencyDomainMappingModel',
    'app/views/validation',
    'app/models/authCheck'
], function (_, Backbone, AgencyDomainModel, Validation, AuthCheck) {
    'use strict';
    var IndustryModel = Backbone.Model.extend({
        defaults: {
            options : [],
            selected_industry: null
        },
        initialize: function(){
            this.listenTo(AgencyDomainModel, 'change',
                          this.getVerticals);
        },
        urlRoot: "industry/get_industries?agencyId=?&agencyUrlMappingId=?",
        parse: function( data, xhr ) {
            return {
                options: data.options
            };
        },
        getVerticals: function() {
            var agencyId = AgencyDomainModel.get("agency_id"),
            agencyUrlMappingId = AgencyDomainModel.get("id");
            if (agencyId !== undefined && agencyId !== null &&
                agencyUrlMappingId !== undefined &&
                agencyUrlMappingId  !== null) {
                this.url = "http://" + window.location.hostname +
                              "/smblauncher/industry/get_industries?agencyId=" +
                              agencyId + "&agencyUrlMappingId=" +
                              agencyUrlMappingId;
                this.fetch({
                    complete: this.displayError
                });
            }
        },
        displayError: function(object, fetchStatus) {
            if(fetchStatus == "error") {
                AuthCheck.isAuthenticated(object);
                Validation.showPopUpMessage(
                    "error", "Error fetching industries."
                );
            }
        }
    });
    return new IndustryModel();
});

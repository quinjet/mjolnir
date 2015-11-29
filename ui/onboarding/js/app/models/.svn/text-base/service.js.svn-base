define([
    'underscore',
    'backbone',
    'app/models/industry',
    'app/models/agencyDomainMappingModel',
    'app/views/validation',
    'app/models/authCheck'
], function (_, Backbone, IndustryModel, AgencyDomainModel, Validation,
             AuthCheck) {
    'use strict';
    var ServiceModel = Backbone.Model.extend({
        defaults: {
            options : [],
            selected_service: null,
            selected_service_name: null
        },
        initialize: function(){
            this.listenTo(IndustryModel, 'industry_selected', this.getServices);
        },
        getServices: function(industryId) {
            var agencyId = AgencyDomainModel.get("agency_id"),
            agencyUrlMappingId = AgencyDomainModel.get("id");
            this.set(this.defaults);
            if(industryId !== undefined && industryId !== null &&
               agencyId !== undefined && agencyId !== null &&
               agencyUrlMappingId !== undefined &&
               agencyUrlMappingId  !== null) {
                this.url = "http://" + window.location.hostname +
                              "/smblauncher/services/get_services?agencyId=" +
                              agencyId + "&agencyUrlMappingId=" +
                              agencyUrlMappingId + "&verticalId=" + industryId;
                this.fetch({
                    complete: this.displayError
                });
            }
        },
        displayError: function(object, fetchStatus) {
            if(fetchStatus == "error") {
                AuthCheck.isAuthenticated(object);
                Validation.showPopUpMessage(
                    "error", "Error fetching services."
                );
                $("#advertising-plan").hideLoading();
            }
        },
        parse: function(data, xhr) {
            $("#advertising-plan").hideLoading();
            return {
                options: data.options
            };
        }
    });
    return new ServiceModel();
});

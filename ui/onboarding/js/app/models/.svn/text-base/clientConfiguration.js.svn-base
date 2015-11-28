define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/industry',
    'app/models/service',
    'app/models/clientsdetails',
    'app/models/agencyDomainMappingModel',
    'app/models/serviceTag',
    'app/views/validation',
    'app/models/authCheck'
    ],
    function (
        $,
        _,
        Backbone,
        IndustryModel,
        ServiceModel,
        ClientDetailsModel,
        AgencyDomainMappingModel,
        ServiceTagModel,
        Validation,
        AuthCheck
    ) {
    var clientConfigurationsModel = Backbone.Model.extend({
        initialize: function(){
            this.deferred = new $.Deferred();
        },
        deferred: Function.constructor.prototype,
        saveClientConfigurations: function(){
            var json = {};
            var configuration = {};
            var params = Validation.getAllParameters();
            var self;
            configuration.subVertical = {
                "name": ServiceModel.get('selected_service_name'),
                "alias": ServiceModel.get('selected_service_name'),
                "expertSubVerticalId": ServiceModel.get('selected_service')
            };
            configuration.budget = "1";
            configuration.verticalId = IndustryModel.get('selected_industry');
            configuration.name = ClientDetailsModel.get('business_name');
            configuration.business_name = ClientDetailsModel.get('business_name');
            configuration.contactName = ClientDetailsModel.get('contact_name');
            configuration.contactEmail =
                ClientDetailsModel.get('email_address');
            configuration.contactPhoneNumber =
                ClientDetailsModel.get('contact_number');
            configuration.contactAddress = ClientDetailsModel.get('address');
            configuration.clientWebsite = ClientDetailsModel.get('website');
            configuration.domainURL = ClientDetailsModel.get('website');
            if(configuration.domainURL == "" || configuration.domainURL == undefined) {
                configuration.domainURL = "http://sokratidummyurl.com";
            }
            configuration.currencyCode = AgencyDomainMappingModel.get('currency_code');
            configuration.agencyId = AgencyDomainMappingModel.get('agency_id');
            configuration.agencyDomainUrlId =
                AgencyDomainMappingModel.get('id');
            configuration.agencyDomainUrl = AgencyDomainMappingModel.get('domain_url');
            configuration.timezoneId =
                AgencyDomainMappingModel.get('timezone_id');
            configuration.countryCode = ClientDetailsModel.get("countryCode");
            configuration.businessCity = ClientDetailsModel.get("businessCity");
            configuration.businessState = ClientDetailsModel.get("businessState");
            configuration.businessCountry = ClientDetailsModel.get("businessCountry");
            configuration.serviceTag =
                {
                    tag : ServiceTagModel.get("tag"),
                    verticalId : ServiceTagModel.get("verticalId"),
                    verticalName : ServiceTagModel.get("verticalName"),
                    subVerticalId : ServiceTagModel.get("subVerticalId"),
                    subVerticalName : ServiceTagModel.get("subVerticalName")
                };

            this.set('configuration', configuration);
            this.url = "http://" + window.location.hostname + "/smblauncher/" +
                       "client_configuration/post_client_configuration";
            self = this;
            $("#launch-tab").attr("disabled", "disabled");
            $.ajax({
                url: this.url,
                type: "post",
                data: {
                    config: {
                        configuration: this.get('configuration')
                    }
                },
                success: function(response){
                    var params = Validation.getAllParameters();
                    if(response !== null)
                    {
                        if((response["clientId"] != undefined &&
                           response["clientId"] != 0) ||
                           response["savedInDb"] == true){
                            self.showCongratsMessage();
                        }
                        else {
                            $("#launch-container").hideLoading();
                            $("#launch-tab").removeAttr("disabled");
                            Validation.showPopUpMessage(
                                "error",
                                "Error occured while launching client. Please" +
                                " retry after sometime."
                            );
                        }
                    }
                    else {
                        $("#launch-container").hideLoading();
                        $("#launch-tab").removeAttr("disabled");
                        Validation.showPopUpMessage(
                            "error",
                            "Error occured while launching client."
                        );
                    }
                },
                error: this.showError
            });
        },
        showCongratsMessage: function() {
            $("#congratsModal").modal({
                keyboard: false,
                backdrop: false
            });
            $("#launch-container").hideLoading();
            $("#congratsModal").attr("style", "display: block");
            $("#congratsModal").modal("show");
        },
        showError: function(model, response){
            $("#launch-container").hideLoading();
            AuthCheck.isAuthenticated(model);
            $("#launch-tab").removeAttr("disabled");
            Validation.showPopUpMessage(
                "error",
                "Error occured while launching client."
            );
        }
    });
    return clientConfigurationsModel;
})

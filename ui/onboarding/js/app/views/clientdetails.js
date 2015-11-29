define([
    'backbone',
    'text!app/templates/clientDetails.html',
    'app/models/clientsdetails',
    'app/models/clientConfiguration',
    'app/views/validation'
], function (Backbone, clientDetailsTemplate, ClientDetailsModel,
             ClientConfigurationModel, Validation) {
    var ClientDetails = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        model: ClientDetailsModel,
        el: '#clientDetails',
        cc: null,
        events: {
           'change input#contactName': 'changeContactName',
           'change input#businessName': 'changeBusinessName',
           'change input#contactNumber': 'changeContactNumber',
           'change input#website': 'changeWebsite',
           'change input#displayUrl': 'changeDisplayUrl',
           'change input#emailAddress': 'changeEmailAddress',
           'change textarea#address': 'changeAddress',
           'click a#launchButton' : "launch"
        },
        render: function() {
            var parameters = {};
            var city = "";
            if(this.model.get("businessCity") != null &&
               this.model.get("businessCity") != "") {
                city = this.model.get("businessCity").split(",")[0];
            }
            else {
                city = this.model.get("businessCity");
            }
            parameters =
                {
                    business_name: this.model.get("business_name"),
                    contact_name: this.model.get("contact_name"),
                    address: this.model.get("address"),
                    contact_number: this.model.get("contact_number"),
                    website: this.model.get("website"),
                    email_address: this.model.get("email_address"),
                    business_city: city,
                    business_state: this.model.get("businessState"),
                    business_country: this.model.get("businessCountry")
                }
            parameters["launcher"] = "";
            var template = _.template(clientDetailsTemplate, parameters);
            this.$el.html(template);
        },
        changeContactName: function(){
            var contactName = $(this.el).find('input#contactName').val();
            contactName = contactName.replace(/\t/g, " ").trim();
            $(this.el).find('input#contactName').val(contactName);
            this.model.set('contact_name',contactName);
        },
        changeBusinessName: function(){
            var businessName = $(this.el).find('input#businessName').val();
            businessName = businessName.replace(/\t/g, " ").trim();
            $(this.el).find('input#businessName').val(businessName);
            this.model.set('business_name',businessName);
        },
        changeContactNumber: function(){
            var contactNumber = $(this.el).find('input#contactNumber').val();
            this.model.set('contact_number',contactNumber);
        },
        changeWebsite: function(){
            var website = $(this.el).find('input#website').val();
            this.model.set('website',website);
        },
        changeEmailAddress: function(){
            var emailAddress = $(this.el).find('input#emailAddress').val();
            this.model.set('email_address',emailAddress);
        },
        changeAddress: function(){
            var address = $(this.el).find('textarea#address').val();
            this.model.set('address',address);
        },
        validate: function() {
            var result = true;
            var params = Validation.getAllParameters();
            var websiltUrl = URL($("#website").val());
            var websiteDomain = websiltUrl.domain();
            var msg = [];
            if(($("#service-tag-input").val() == null ||
               $("#service-tag-input").val() == undefined ||
               $("#service-tag-input").val() == "") &&
               ($("#serviceTagInputCheckBox:checked").val() == undefined ||
               $("#serviceTagInputCheckBox:checked").val() == null ||
               $("#serviceTagInputCheckBox:checked").val() == "")) {
                result = false;
                msg.push("Please choose either Search For Your Services or " +
                         "select checkbox.");
            }
            if($("#businessName").val() == "" || $("#businessName").val() == null ||
               $("#businessName").val().match(/[\t]/) != null) {
                //Validation.setMessage($("#businessName"), "Business Name is required");
                result = false;
                msg.push("Please fill Name of the Business correctly");
            }
            if($("#contactName").val() == "" || $("#contactName").val() == null ||
               $("#contactName").val().match(/[\t]/) != null) {
                //Validation.setMessage($("#contactName"), "Contact Name is required");
                result = false;
                msg.push("Please fill Name of the Business Contact Person correctly");
            }
            if($("#contactNumber").val().match(/^\+([0-9]{1,3})\-([0-9]{7,12})$/) == null) {
                //Validation.setMessage($("#contactNumber"), "Valid Number required eg. +91-9876543210");
                result = false;
                msg.push("Please fill Client Phone correctly");
            }
            if($("#address").val() == "" || $("#address").val() == null ||
               $("#address").val().match(/[\t]/) != null) {
                result = false;
                msg.push("Please fill Address correctly");
            }
            if($("#emailAddress").val().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null) {
                //Validation.setMessage($("#emailAddress"), "Valid Email Address required");
                result = false;
                msg.push("Please fill Email Address correctly");
            }
            if($("#website").val() != null && $("#website").val() != "" && $("#website").val() != undefined &&
               $("#website").val().match(/^((http|https|ftp|ftps):\/\/)([a-z0-9\-]+\.)?([a-z0-9\-]+\.)+[a-z0-9]{2,12}(\.[a-z0-9]{2,12})?(\/[^\s]*)?$/) == null) {
                //Validation.setMessage($("#website"), "Valid URL required eg.http://www.abc.com");
                result = false;
                msg.push("Please fill Website correctly");
            }
            if($("#businessCity").val() == "") {
                result = false;
                msg.push("Please fill City correctly");
            }
            if($("#businessState").val() == "") {
                result = false;
                msg.push("Please fill City correctly");
            }
            if($("#businessCountry").val() == "") {
                result = false;
                msg.push("Please fill City correctly");
            }
            if(result == false) {
                var newMessage =
                    "Please fill all mandatory fields correctly.";
                if(msg.length > 0) {
                    newMessage = msg[0];
                }
                Validation.showPopUpMessage("error", newMessage);
            }
            return result;
        },
        launch: function(){
            var pendingCalls = false;
            if(this.cc == null || this.cc == undefined) {
                this.cc = new ClientConfigurationModel();
            }
            if($.active > 0) {
                Validation.showPopUpMessage(
                    "warning", "There are some pending requests, please let " +
                    "them finish and then hit Signup"
                );
                pendingCalls = true;
            }
            if(this.validate() == true && pendingCalls == false) {
                $("#launch-container").showLoading(
                    "<h2><img src='images/load.GIF'/>  " +
                    "Please Wait...</h2>"
                );
                this.cc.saveClientConfigurations();
            }
        }
    });
    return ClientDetails;
});

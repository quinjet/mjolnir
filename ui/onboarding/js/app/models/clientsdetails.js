define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var ClientDetailsModel = Backbone.Model.extend({
        // Default attributes for the todo
        // and ensure that each todo created has `title` and `completed` keys.
        defaults: {
            business_name: null,
            contact_name: null,
            address:null,
            contact_number:null,
            website:null,
            displayURL:null,
            email_address:null,
            lead_contact_number:null,
            contract_id: "NA",
            adwords_client_id: null,
            businessCity:null,
            locationId:null,
            countryCode:null,
            businessState:null,
            businessCountry:null,
            zipCode:null
        }
    });

    return new ClientDetailsModel();
});
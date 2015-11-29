define([
    'jquery',
    'underscore',
    'backbone',
    'bloodHound',
    'app/views/clientdetails',
    'app/models/configDbClient',
    'app/views/validation',
    'app/models/clientsdetails'
    ], function ($,
                 _,
                 Backbone,
                 BloodHound,
                 ClientDetails,
                 ConfigDbClientModel,
                 Validation,
                 ClientDetailsModel) {
    'use strict';

    var clientDetailsView = Backbone.View.extend({
        initialize: function(){
            this.render();
            this.listenTo(ClientDetailsModel, "BUSINESS_CITY_CHANGED",
                          this.cityChanged);
        },
        tokenInputTag: null,
        tokenInputTagState: null,
        tokenInputTagCountry: null,
        el: '#client-details',
        events: {
            'keypress #businessCity': "deleteStateAndCountry",
            'keydown #businessCity': "checkForDelete",
            'focusout #businessName': "checkForNameAvailability",
            'focusout #website': "fillDomainInDisplayUrl",
            'keydown #displayUrl': "checkLengthAndRestrict"
        },
        render: function() {
            var clientDetails = new ClientDetails();
            $("#businessCity").on("focus", this.changeColorTypeahead);
            $("#businessCity").on("focusout", this.changeColorOriginal);

            var engine = new Bloodhound({
                name: 'cities',
                limit: 50,
                remote: {
                    url: "http://" + window.location.hostname +
                         "/smblauncher/cities/get_cities_with_location_id?" +
                         "type=[city]&location=%QUERY",
                    filter: function (results) {
                        $("#businessCity").attr(
                            "style", "background:none;"
                        );
                        $.each(results, function (index, value) {
                            var tokens = value.canonicalName.split(",");
                            value.canonicalName = "";
                            for(var j = 0; j < tokens.length; j++) {
                                tokens[j] = tokens[j].trim();
                                tokens[j] = tokens[j].charAt(0).toUpperCase() +
                                            tokens[j].slice(1);
                            }
                            value.canonicalName = tokens.join(", ");
                            value.name = value.canonicalName;
                            value.toDisplay =
                                value.canonicalName.split(", ")[0];
                            value.stateAndCountry =
                                tokens[1] + ", " + tokens[2];
                            value.type = value.type.charAt(0).toUpperCase() +
                                         value.type.slice(1);
                        });
                        return results;
                    }
                },
                datumTokenizer: function(d) {
                    return Bloodhound.tokenizers.whitespace(d.canonicalName);
                },
                queryTokenizer: function(d) {
                    $("#businessCity").attr(
                        "style", "background:url(" +
                        "'images/ajax-loader.gif') no-repeat 99%;"
                    );
                    return Bloodhound.tokenizers.whitespace;
                }
            });

            engine.initialize();

            this.tokenInputTag = $("#businessCity").typeahead(
            {
                minLength: 3,
                highlight: true,
                hint: false
            },
            {
                displayKey: 'toDisplay',
                name: 'business-cities',
                templates: {
                    empty: [
                        '<div class="empty-message">',
                            'unable to find any city.',
                        '</div>'
                    ].join('\n'),
                    suggestion: _.compile([
                        '<p class="business-city-type"><%=type%></p>',
                        '<p class="business-city">' +
                            '<%=canonicalName%>' +
                        '</p>',
                        '<hr id="hr-typeahead">'
                    ].join(''))
                },
                source: engine.ttAdapter()
            }).on('typeahead:selected', this.typeAheadSelected);
            if(Validation.markTagInactive())
            {
                $("#contactName").attr("disabled", "disabled");
                $("#businessName").attr("disabled", "disabled");
                $("#adWordsClientId").attr("disabled", "disabled");
            }
        },
        checkForNameAvailability: function(target) {
            $("#image-tag-correct").remove();
            $("#image-tag-wrong").remove();
            if(target.target.value.trim() != "") {
                $("#launch-tab").attr("disabled", "disabled");
                var enteredName =
                    target.target.value.replace(/\t/g, " ").trim();
                ConfigDbClientModel.trigger("CHECK_CLIENT_NAME", enteredName);
            }
        },
        fillDomainInDisplayUrl: function() {
            if($("#displayUrl").val() == "") {
                var websiteUrl = URL($("#website").val());
                $("#displayUrl").val(websiteUrl.host().substring(0, 35));
            }
        },
        checkLengthAndRestrict: function() {
            var displayUrl = $("#displayUrl").val();
            if(displayUrl.length == 35) {
                Validation.showPopUpMessage(
                    "error", "Max length of display url cannot be more than " +
                    "35 characters."
                );
            }
        },
        typeAheadSelected: function(target, datum) {
            ClientDetailsModel.set("businessCity", datum.canonicalName);
            ClientDetailsModel.set("locationId", datum.sokId);
            ClientDetailsModel.set("countryCode", datum.countryCode);
            ClientDetailsModel.trigger("BUSINESS_CITY_CHANGED",
                                       datum.name.split(", ")[1],
                                       datum.name.split(", ")[2]);
            $("#token-input-businessCity").change();
        },
        deleteStateAndCountry: function(target) {
            if(target.keyCode != 13) {
                this.setStateAndCountry();
            }
        },
        checkForDelete: function(target) {
            $("#businessCity").siblings(".tt-dropdown-menu").
                css("margin-left", "0px");
            if(target.keyCode == 8) {
                this.setStateAndCountry();
            }
        },
        setStateAndCountry: function() {
            $("#businessState").val("");
            $("#businessCountry").val("");
            ClientDetailsModel.set("businessState", null);
            ClientDetailsModel.set("businessCountry", null);
        },
        cityChanged: function(state, country) {
            ClientDetailsModel.set("businessState", state);
            $("#businessState").val(state);
            ClientDetailsModel.set("businessCountry", country);
            $("#businessCountry").val(country);
        }
    })
    return clientDetailsView;
})

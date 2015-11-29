define([
    'underscore',
    'backbone',
    'text!app/templates/serviceTags.html',
    'app/views/serviceTag',
    'app/models/service',
    'app/models/industry',
    'app/views/validation',
    'app/models/agencyDomainMappingModel',
    'app/models/serviceTag',
], function (_,
             Backbone,
             ServiceTagsTemplate,
             ServiceTagView,
             ServiceModel,
             IndustryModel,
             Validation,
             AgencyDomainModel,
             ServiceTagModel) {
    'use strict';
    var ServiceTagsView = Backbone.View.extend({
        el: '#service-tag',
        service: null,
        tokenInputTag: null,
        UN_MAPPED_VERTICAL: "Unmapped Accounts",
        UN_MAPPED_SUB_VERTICAL: "Unmapped Accounts",
        events: {
            'keypress input#service-tag-input': 'getServiceTags',
            'click input#serviceTagInputCheckBox' : 'othersSelected'
        },
        initialize: function() {
            this.listenTo(AgencyDomainModel, 'AGENCY_DOMAIN_MODEL_FETCHED', this.render);
            this.listenTo(ServiceModel, 'services_rendered', this.setService);
        },
        render: function() {
            var template = _.template(ServiceTagsTemplate);
            this.$el.html(template);
            var agencyDomainUrlId = AgencyDomainModel.get("id");
            var self = this;
            var engine = new Bloodhound({
                name: 'service-tags',
                limit: 50,
                remote: {
                    url: "http://" + window.location.hostname +
                         "/smblauncher/service_tag/get_tags?" +
                         "agencyDomainUrlMappingId=" + agencyDomainUrlId +
                         "&tag=%QUERY",
                    filter: function (results) {
                        $("#service-tag-input").attr(
                            "style", "background:none; position: relative; " +
                            "vertical-align: top; " +
                            "background-color: transparent;"
                        );
                        $.each(results, function (index, value) {
                            value.tag = value.tag.charAt(0).toUpperCase() +
                                        value.tag.slice(1);
                            value.name = value.tag + " : " +
                                         value.verticalName + " > " +
                                         value.subVerticalName;
                            value.self = self;
                        });
                        if(results.length <= 0) {
                            self.showOthersCheckbox();
                        }
                        return results;
                    }
                },
                datumTokenizer: function(d) {
                    return Bloodhound.tokenizers.whitespace(d.canonicalName);
                },
                queryTokenizer: function(d) {
                    $("#service-tag-input").attr(
                        "style", "background:url(" +
                        "'images/ajax-loader.gif') no-repeat 99%;" +
                        "position: relative; vertical-align: top; " +
                        "background-color: transparent;"
                    );
                    return Bloodhound.tokenizers.whitespace;
                }
            });

            engine.initialize();

            this.tokenInputTag = $("#service-tag-input").typeahead(
            {
                minLength: 3,
                highlight: true
            },
            {
                displayKey: 'name',
                name: 'service-tag',
                templates: {
                    empty: [
                        '<div class="empty-message">',
                            '<i>unable to find that tag</i>',
                        '</div>'
                    ].join('\n'),
                    suggestion: _.compile([
                        '<p class="tag-name">' +
                            '<strong>#tag: </strong><%=tag%>' +
                        '</p>',
                        '<p class="tag-vertical">' +
                            '<i><%=verticalName%></i> ' +
                            '<i><%=subVerticalName%></i>' +
                        '</p>',
                        '<hr id="hr-typeahead">'
                    ].join(''))
                },
                source: engine.ttAdapter()
            }).on('typeahead:selected', this.typeAheadSelected);
            if(Validation.markTagInactive())
            {
                $("#service-tag-container").hide();
            }
        },
        showOthersCheckbox: function() {
            $("#checkboxContainer").attr("style", "display:block");
        },
        typeAheadSelected: function(target, datum) {
            var vertical = datum.verticalName;
            ServiceTagModel.set({
                tag : datum.tag,
                verticalId : datum.verticalId,
                verticalName : datum.verticalName,
                subVerticalId : datum.subVerticalId,
                subVerticalName : datum.subVerticalName
            });
            $("#service-tag-input").attr(
                "style", "background:url(" +
                "'images/ajax-loader.gif') no-repeat 99%;" +
                "position: relative; vertical-align: top; " +
                "background-color: transparent;"
            );
            if(vertical != undefined) {
                $("#industry_select").val(vertical);
                if($("#industry_select").val() == "" ||
                   $("#industry_select").val() == undefined) {
                    ServiceTagModel.set("found", false);
                    $("#industry_select").val(datum.self.UN_MAPPED_VERTICAL);
                    datum.self.service = datum.self.UN_MAPPED_SUB_VERTICAL;
                }
                else {
                    datum.self.service = datum.subVerticalName;
                }
                $("#industry_select").change();
            }
            else {
                ServiceTagModel.set("found", false);
                $("#industry_select").val(datum.self.UN_MAPPED_VERTICAL);
                datum.self.service = datum.self.UN_MAPPED_SUB_VERTICAL;
                $("#industry_select").change();
            }
        },
        setService: function() {
            var options = ServiceModel.get("options");
            var optionFound = null;
            var found = false;
            for(var i = 0; i < options.length; i++) {
                if(options[i].name == this.service) {
                    found = true;
                    optionFound = options[i];
                    break;
                }
            }
            if($('#service-tag-input').val() != "" && found == true) {
                if(this.service != undefined) {
                    IndustryModel.set(
                        'selected_industry', optionFound.verticalId
                    );
                    $("#service_select").val(this.service).change();
                    if($("#service_select").val() == "" ||
                       $("#service_select").val() == undefined) {
                        ServiceTagModel.set("found", false);
                        $("#industry_select").val(this.UN_MAPPED_VERTICAL);
                        IndustryModel.set(
                            'selected_industry',
                            $('#industry_select option:selected').attr('id')
                        );
                        $("#service_select").val(
                            this.UN_MAPPED_SUB_VERTICAL
                        ).change();
                    }
                }
                else {
                    ServiceTagModel.set("found", false);
                    $("#industry_select").val(this.UN_MAPPED_VERTICAL);
                    IndustryModel.set(
                        'selected_industry',
                        $('#industry_select option:selected').attr('id')
                    );
                    $("#service_select").val(
                        this.UN_MAPPED_SUB_VERTICAL
                    ).change();
                }
            }
            else if($('#service-tag-input').val() != "" && found == false) {
                ServiceTagModel.set("found", false);
                $("#industry_select").val(this.UN_MAPPED_VERTICAL);
                IndustryModel.set(
                    'selected_industry',
                    $('#industry_select option:selected').attr('id')
                );
                $("#service_select").val(
                    this.UN_MAPPED_SUB_VERTICAL
                ).change();
            }
            $("#service-tag-input").attr(
                "style", "background:none; position: relative; " +
                "vertical-align: top; " +
                "background-color: transparent;"
            );
        },
        othersSelected: function(target) {
            var self = this;
            if($(target.currentTarget + ":checked").val() != undefined ||
               $(target.currentTarget + ":checked").val() != null) {
                ServiceTagModel.set("found", false);
                $("#industry_select").val(this.UN_MAPPED_VERTICAL).change();
                // $("#service_select").val(this.UN_MAPPED_SUB_VERTICAL).change();
            }
            else {
                var datum =
                    {
                        tag : ServiceTagModel.get("tag"),
                        verticalId : ServiceTagModel.get("verticalId"),
                        verticalName : ServiceTagModel.get("verticalName"),
                        subVerticalId : ServiceTagModel.get("subVerticalId"),
                        subVerticalName :
                            ServiceTagModel.get("subVerticalName"),
                        self : self
                    };
                IndustryModel.set(
                    'selected_industry',
                    ServiceTagModel.get("verticalId")
                );
                ServiceTagModel.set("found", true);
                this.typeAheadSelected(null, datum);
            }
        }
    });
    return ServiceTagsView;
});

define([
    'backbone',
    'text!app/templates/agencyDomainLevelView.html',
    'app/models/agencyDomainMappingModel',
    'app/views/validation'
], function (Backbone, AgencyDomainTemplate, AgencyDomainModel, Validation) {
    var DomainLevelView = Backbone.View.extend({
        model: AgencyDomainModel,
        initialize: function(){
            this.listenTo(this.model, 'AGENCY_DOMAIN_MODEL_FETCHED', this.render);
            this.model.getDomainInfo();
        },
        el: '#head-tag',
        render: function() {
            var template = _.template(AgencyDomainTemplate,
                                      this.model.toJSON());
            this.$el.html(template);
        }
    });
    return DomainLevelView;
});

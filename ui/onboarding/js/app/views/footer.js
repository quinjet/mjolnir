define([
    'backbone',
    'text!app/templates/footer.html',
    'app/models/agencyDomainMappingModel'
], function (Backbone, Footer, AgencyDomainModel) {
    var FooterView = Backbone.View.extend({
        model: AgencyDomainModel,
        initialize: function(){
            this.render();
            this.listenTo(AgencyDomainModel, 'AGENCY_DOMAIN_MODEL_TRIGGER',
                          this.render);
        },
        el: '#colophon',
        render: function() {
            var template = _.template(Footer, this.model.toJSON());
            this.$el.html(template);
        }
    });
    return FooterView;
});

define([
    'backbone',
    'text!app/templates/service.html',
    'app/models/service',
    'app/views/validation'
], function (Backbone, serviceTemplate, ServiceModel, Validation) {
    var ServiceView = Backbone.View.extend({
        model: ServiceModel,
        initialize: function() {
            this.render();
            this.listenTo(this.model, 'change', this.render);
        },
        el: '#service',
        events: {
            'change select#service_select': 'setSelectedService'
        },
        render: function() {
            var template = _.template(serviceTemplate, this.model.toJSON());
            this.$el.html(template);
            this.model.trigger("services_rendered");
            if(Validation.markTagInactive())
            {
                $("#service_select").attr("disabled", "disabled");
            }
        },
        setSelectedService: function(){
            var serviceId =
                this.$el.find('#service_select option:selected').attr('id');
            var service_name =
                this.$el.find('#service_select option:selected').text();
            this.model.set('selected_service', serviceId);
            this.model.set('selected_service_name', service_name);
            this.model.trigger('service_selected', serviceId);
        }
    });
    return ServiceView;
});

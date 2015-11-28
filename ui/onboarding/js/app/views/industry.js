define([
    'backbone',
    'text!app/templates/industry.html',
    'app/models/industry',
    'app/views/validation'
], function (Backbone, industryTemplate, IndustryModel, Validation) {
    var IndustryView = Backbone.View.extend({
        model: IndustryModel,
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },
        el: '#industry',
        events: {
            'change select#industry_select': 'getServicesList'
        },
        render: function(model) {
            var template = _.template(industryTemplate, this.model.toJSON());
            this.$el.html(template);
            if(Validation.markTagInactive())
            {
                $("#industry_select").attr("disabled", "disabled");
            }
        },
        getServicesList: function() {
            this.model.set(
                'selected_industry',
                this.$el.find('#industry_select option:selected').attr('id')
            );
            var industryId = $('#industry_select option:selected').attr('id');
            this.model.trigger("industry_selected", industryId);
            if(industryId !== null && industryId !== undefined &&
               industryId !== "" && Validation.markTagInactive() == false){
                $("#advertising-plan").showLoading(
                    "<h2><img src='images/load.GIF'/>  " +
                    "Please Wait...</h2>"
                );
            }
        }
    });
    return IndustryView;
});

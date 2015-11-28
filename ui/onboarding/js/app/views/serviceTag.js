define([
    'backbone'
], function (Backbone) {
    var ServicTagView = Backbone.View.extend({
        tagName: "option",
        initialize: function() {
        },
        render: function(model) {
            var value = this.model.get("tag") + " : " +
                        this.model.get("verticalName") + " > " +
                        this.model.get("subVerticalName");
            $(this.el).data("vertical", this.model.get("verticalName"));
            $(this.el).data("subVertical", this.model.get("subVerticalName"));
            $(this.el).html(value);

            return this;
        }
    });
    return ServicTagView;
});

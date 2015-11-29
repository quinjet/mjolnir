define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/agencyDomainLevelView',
    'app/models/agencyDomainMappingModel',
    'app/views/clientDetailsView',
    'app/views/validation',
    'app/views/footer',
    'app/views/serviceTags',
    'app/views/industry',
    'app/views/service',
    'app/models/hadesGetUser',
    'app/models/authCheck'
], function ($,
             _,
             Backbone,
             AgencyDomainView,
             AgencyDomainModel,
             ClientDetailsView,
             Validation,
             Footer,
             ServiceTagsView,
             IndustryView,
             ServiceView) {

    'use strict';

    var AppView = Backbone.View.extend({
        clientDetailsView:  null,
        cc: null,
        initialize: function () {
            var domainConfig =  new AgencyDomainView();
            var footer = new Footer();
            var serviceTagsView = new ServiceTagsView();
            $('#closeModal').on('click', this.launchAnother);
            this.render();
        },
        render: function() {
            var industryView = new IndustryView();
            var serviceView = new ServiceView();
            this.clientDetailsView = new ClientDetailsView();
        },
        launchAnother: function() {
            window.location.reload();
        }
    });
    return AppView;
});

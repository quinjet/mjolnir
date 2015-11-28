define([
    'underscore',
    'backbone',
], function (_, Backbone) {
    'use strict';
    var ServiceTagModel = Backbone.Model.extend({
        defaults: {
            tag: null,
            verticalId: null,
            verticalName: null,
            subVerticalId: null,
            subVerticalName: null,
            found: true
        }
    });
    return new ServiceTagModel();
});

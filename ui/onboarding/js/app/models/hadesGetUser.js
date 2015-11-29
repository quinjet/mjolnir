define([
    'backbone'
], function (Backbone) {
    'use strict';
    var HadesGetUserModel = Backbone.Model.extend({
        defaults: {
            users: null
        },
        urlRoot: '/hadesV2/users',
        initialize: function() {
            this.url = this.urlRoot + "?jsonQuery={" +
                       "\"@class\":\"com.sokrati.hadesObjects.aclActions." +
                       "getUsers.GetUserRequest\"}";
            this.fetch({
                cache: false,
                reset: true,
                complete: function(object, fetchStatus) {
                    if(fetchStatus == "error") {
                        signOut();
                    }
                }
            });
        }
    });
    return new HadesGetUserModel();
});

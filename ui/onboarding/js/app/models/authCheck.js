define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';
    var AuthCheck = Backbone.Model.extend({
        isAuthenticated: function(obj) {
            var response = JSON.parse(obj.responseText);
            if(response["error"].match("Auth Failed."))
            {
                signOut();
            }
        }
    });
    return new AuthCheck();
});

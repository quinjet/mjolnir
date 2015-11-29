/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'

        },
        validator: {
            deps: ['jquery']
        },
        blockUI: {
            deps: ['jquery']
        },
        loading: {
           deps: ['jquery',
                  'blockUI']
        },
        parseURL: {
            deps: ['jquery']
        },
        bootStrap: {
            deps: ['jquery']
        },
        typeAhead: {
            deps: ['jquery']
        },
        bloodHound: {
            deps: ['jquery']
        }
    },
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        text: 'lib/requirejs-text/text',
        validator: 'lib/inputValidator',
        blockUI: 'lib/jquery.blockUI.min',
        loading: 'lib/loading-ui',
        bootStrap: 'lib/bootstrap',
        parseURL: 'lib/url-min',
        typeAhead: 'lib/typeahead.jquery',
        bloodHound: 'lib/bloodhound'
    },
    waitSeconds: 300
});

require([
    'backbone',
    'app/views/app',
    'loading',
    'parseURL',
    'validator',
    'bootStrap',
    'typeAhead',
    'bloodHound'
], function (Backbone, AppView, Loading) {
    new AppView();
});

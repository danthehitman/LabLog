requirejs.config({
    paths: {
        'text': '../../lib/requirejs-text/text',
        'durandal': '../../lib/durandal/js',
        'plugins': '../../lib/durandal/js/plugins',
        'transitions': '../../lib/durandal/js/transitions',
        'knockout': '../../lib/knockout/dist/knockout',
        'jquery': '../../lib/jquery/dist/jquery'
    }
});

define(function (require) {
    var system = require('durandal/system'),
        app = require('durandal/app');

    system.debug(true);

    app.title = 'LabLog API Login';

    app.configurePlugins({
        router: true,
        dialog: true
    });

    app.start().then(function () {
        app.setRoot('shell');
    });
});
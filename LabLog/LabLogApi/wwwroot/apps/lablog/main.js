requirejs.config({
    paths: {
        text:'/lib/requirejs-text/text',
        durandal: '/lib/Durandal/js',
        plugins: '/lib/Durandal/js/plugins',
        transitions: '/lib/Durandal/js/transitions',
        knockout: '/lib/knockout/dist/knockout',
        jquery: '/lib/jquery/dist/jQuery',
        jqueryUi: '/lib/jquery-ui/ui',
        view: 'view',
        model: 'model',
        service: 'service',
        sessionService: "/apps/lablog/service/sessionservice",
        cookies: '/lib/js-cookie/src/js.cookie'
    },
    map: {
        "*": {
            ko: "knockout",
            utils: "/apps/common/utils.js",
            llapi: "/apps/lablog/service/lablogapi.js",
            appState: "/apps/lablog/model/appstate.js",
        }
    },
    shim: {
        'jquery': {
            exports: '$'
        }
        , 'jquery.cookie': {     
            deps: ['jquery']
        }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'], function (system, app, viewLocator) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'hitmanlabs';

    app.configurePlugins({
        router: true,
        dialog: true
    });

    app.start().then(function () {
        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('app');
        $.ajaxSetup({ cache: false });
    });
});

requirejs.config({
    paths: {
        text: '/lib/requirejs-text/text',
        durandal: '/lib/Durandal/js',
        plugins: '/lib/Durandal/js/plugins',
        transitions: '/lib/Durandal/js/transitions',
        knockout: '/lib/knockout/dist/knockout',
        jquery: '/lib/jquery/dist/jquery',
        jqueryUi: '/lib/jquery-ui/ui',
        sessionService: "/apps/common/service/sessionservice",
        llapi: "/apps/common/service/lablogapi",
        cookies: '/lib/js-cookie/src/js.cookie'
    },
    map: {
        "*": {
            ko: "knockout",
            utils: "/apps/common/utils.js",
            appState: "/apps/common/model/appstate.js",
            navService: "/apps/lablog/service/navigationservice.js",
            postModel: "/apps/common/model/postmodel.js",

            homeViewModel: "/apps/lablog/viewmodel/homeviewmodel.js",
            postViewModel: "/apps/lablog/viewmodel/postviewmodel.js"
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

    viewLocator.convertModuleIdToViewId = function (moduleId) {
        return moduleId.replace(/viewmodel/gi, "view");
    };

    app.start().then(function () {
        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodel/app');
        $.ajaxSetup({ cache: false });
    });
});

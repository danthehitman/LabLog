requirejs.config({
    paths: {
        text:'/lib/requirejs-text/text',
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
            navState: "/apps/admin/model/navigationstate.js",
            postModel: "/apps/admin/model/postmodel.js",
            
            fileUploadViewModel: "/apps/admin/viewmodel/fileuploadviewmodel.js",
            postEditViewModel: "/apps/admin/viewmodel/posteditviewmodel.js"
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

    app.title = 'labadmin';

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

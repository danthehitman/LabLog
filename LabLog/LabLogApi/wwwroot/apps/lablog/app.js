define(function (require) {
    var router = require('plugins/router');
    var sessionService = require('sessionService');
    sessionService.initialize();

    return {
        router: router,
        activate: function () {
            router.map([
                { route: 'admin', title: 'Admin', moduleId: 'view/admin', nav: true },
                { route: '', title: ' Blog', moduleId: 'view/blog', nav: true }
            ]).buildNavigationModel();

            //return router.activate({ pushState: true });
            return router.activate();
        }
    };
});
define(function (require) {
    var router = require('plugins/router');
    var sessionService = require('sessionService');
    sessionService.initialize();

    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Home', moduleId: 'view/home', nav: true },
                { route: 'blog', title: ' Blog', moduleId: 'view/blog', nav: true }
            ]).buildNavigationModel();

            return router.activate({ pushState: true });
        }
    };
});
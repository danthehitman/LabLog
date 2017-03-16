define(function (require) {
  var router = require('plugins/router');
 
  return {
     router: router,
     activate: function () {
       router.map([
           { route: 'apilogin.html', title: 'Home', moduleId: 'home', nav: true },
           { route: 'test', title: 'Test', moduleId: 'home', nav: true }
       ]).buildNavigationModel();
 
       return router.activate({pushState: true});
     }
   };
});
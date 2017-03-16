define(
    function (require) {
        return function home() {
            var self = this;
            var sessionService = require('sessionService');
            
            self.signInClick = function () {
                sessionService.initializeGoogleLogin();
                sessionService.initializeOfflineAccess();
            };

            self.signOutClick = function () {
                sessionService.disconnectFromGoogleSession();
            };
        };
});
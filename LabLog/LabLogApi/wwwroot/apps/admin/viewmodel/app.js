define(['sessionService', 'llapi', 'navState', 'fileUploadViewModel'],
    function (sessionService, llapi, navState, fileUploadViewModel) {
        return function app() {
            var self = this;
            self.sessionService = sessionService;
            self.navState = navState;

            self.activate = function () {
                self.sessionService.initialize();
                self.fileUploadViewModel = new fileUploadViewModel();
            };

            self.setNavigationTab = function (newTab) {
                self.navState.activeTab(newTab);
            };

            self.signInClick = function () {
                sessionService.initializeGoogleLogin();
                sessionService.initializeOfflineAccess();
            };

            self.signOutClick = function () {
                sessionService.disconnectFromGoogleSession();
            };
        };
});
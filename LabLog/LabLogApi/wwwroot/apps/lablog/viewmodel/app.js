define(['sessionService', 'llapi', 'navState', 'homeViewModel', 'postViewModel', 'utils', 'appState'],
    function (sessionService, llapi, navState, homeViewModel, postViewModel, utils, appState) {
        return function app() {
            var self = this;

            self.sessionService = sessionService;
            self.navState = navState;
            self.utils = utils;
            self.appState = appState;

            self.path = "";
            self.pathId = "";

            self.activate = function () {
                self.sessionService.initialize();
                self.homeViewModel = new homeViewModel();
                self.postViewModel = new postViewModel();
                self.parseUrl();
                self.navigateToPath();
            };

            self.navigateToPath = function () {
                switch (self.path) {
                    case self.appState.validPaths.home:
                        self.navState.activeTab(self.navState.tabs.home);
                        self.homeViewModel.initialize();
                        break;
                    case self.appState.validPaths.post:
                        self.navState.activeTab(self.navState.tabs.post);
                        self.postViewModel.initialize(self.pathId);
                        break;
                    default:
                        self.navState.activeTab(self.navState.tabs.home);
                        self.homeViewModel.initialize();
                        break;
                }
            };

            self.parseUrl = function () {
                self.path = self.appState.getPrimaryPath();
                self.pathId = self.appState.getPathId();
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
define(['ko', 'sessionService', 'llapi', 'navService', 'homeViewModel', 'postViewModel', 'utils', 'appState'],
    function (ko, sessionService, llapi, navService, homeViewModel, postViewModel, utils, appState) {
        return function app() {
            var self = this;

            self.sessionService = sessionService;
            self.homeViewModel = homeViewModel;
            self.postViewModel = postViewModel;
            self.navService = navService;
            self.utils = utils;
            self.appState = appState;

            self.tags = ko.observableArray();

            self.activate = function () {
                self.sessionService.initialize();
                self.navService.navigateToPath();
                llapi.getPostTags(self.onGetPostTagsSuccess, self.onError);
                return self;
            };

            self.onGetPostTagsSuccess = function (results) {
                self.tags(results);
            };

            self.onError = function (message) {
                alert("error");
            };

            self.onTagClicked = function (tag) {
                self.navService.navigateToTag(tag);
            };

            self.onHomeClicked = function () {
                self.navService.navigateToHome();
            };

            self.setNavigationTab = function (newTab) {
                self.navService.activeTab(newTab);
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
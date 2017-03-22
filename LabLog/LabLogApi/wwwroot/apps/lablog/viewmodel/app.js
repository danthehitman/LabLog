define(['ko', 'sessionService', 'llapi', 'navState', 'homeViewModel', 'postViewModel', 'utils', 'appState'],
    function (ko, sessionService, llapi, navState, homeViewModel, postViewModel, utils, appState) {
        return function app() {
            var self = this;

            self.sessionService = sessionService;
            self.navState = navState;
            self.utils = utils;
            self.appState = appState;

            self.pageTitle = ko.observable("hitmanlabs");
            self.setAppTitle = ko.computed(function () {
                document.title = self.pageTitle();
            });

            self.pageTitleSubscription = null;

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
                self.disposePageTitleSubscription();
                switch (self.path) {
                    case self.appState.validPaths.home:
                        self.navState.activeTab(self.navState.tabs.home);
                        self.homeViewModel.initialize();
                        self.pageTitle("hitmanlabs: home");
                        break;
                    case self.appState.validPaths.post:
                        self.navState.activeTab(self.navState.tabs.post);
                        self.postViewModel.initialize(self.pathId);
                        self.pageTitleSubscription = self.postViewModel.post().title.subscribe(self.setPageTitleFromPostTitle);
                        break;
                    default:
                        self.navState.activeTab(self.navState.tabs.home);
                        self.homeViewModel.initialize();
                        self.pageTitle("hitmanlabs: home");
                        break;
                }
            };

            self.setPageTitleFromPostTitle = function() {
                self.pageTitle("hitmanlabs: " + self.postViewModel.post().title());
            };

            self.disposePageTitleSubscription = function () {
                if (self.pageTitleSubscription != null)
                    self.pageTitleSubscription.dispose();
                self.pageTitleSubscription = null;
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
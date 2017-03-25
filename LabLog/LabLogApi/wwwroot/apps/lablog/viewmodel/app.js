define(['ko', 'sessionService', 'llapi', 'navState', 'homeViewModel', 'postViewModel', 'utils', 'appState'],
    function (ko, sessionService, llapi, navState, homeViewModel, postViewModel, utils, appState) {
        return function app() {
            var self = this;

            self.sessionService = sessionService;
            self.navState = navState;
            self.utils = utils;
            self.appState = appState;

            self.tags = ko.observableArray();

            self.pageTitle = ko.observable("hitmanlabs");
            self.setAppTitle = ko.computed(function () {
                document.title = self.pageTitle();
            });

            self.pageTitleSubscription = null;

            self.activate = function () {
                self.sessionService.initialize();
                self.homeViewModel = new homeViewModel();
                self.postViewModel = new postViewModel();
                self.navigateToPath();
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
                window.history.pushState({}, "", "/tag/" + tag.name);
                self.navigateToPath();
            };

            self.onHomeClicked = function () {
                window.history.pushState({}, "", "/");
                self.navigateToPath();
            };

            self.navigateToPath = function () {
                self.disposePageTitleSubscription();
                switch (self.appState.getPrimaryPath()) {
                    case self.appState.validPaths.home:
                        self.navState.activeTab(self.navState.tabs.home);
                        self.homeViewModel.loadPosts();
                        self.pageTitle("hitmanlabs: home");
                        break;
                    case self.appState.validPaths.tag:
                        self.navState.activeTab(self.navState.tabs.tag);
                        self.homeViewModel.loadPosts(self.appState.getPathId());
                        self.pageTitle("hitmanlabs: " + decodeURIComponent(self.appState.getPathId()));
                        break;
                    case self.appState.validPaths.post:
                        self.navState.activeTab(self.navState.tabs.post);
                        self.postViewModel.initialize(self.appState.getPathId());
                        self.pageTitleSubscription = self.postViewModel.post().title.subscribe(self.setPageTitleFromPostTitle);
                        break;
                    default:
                        self.navState.activeTab(self.navState.tabs.home);
                        self.homeViewModel.loadPosts();
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
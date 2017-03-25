define(['ko', 'homeViewModel', 'postViewModel', 'appState'],
    function (ko, homeViewModel, postViewModel, appState) {
        var singleton = function navigationService() {
            var self = this;

            self.homeViewModel = homeViewModel;
            self.postViewModel = postViewModel;
            self.appState = appState;

            self.tabs = {
                home: "home",
                post: "post",
                tag: "tag"
            };
            
            self.activeTab = ko.observable(self.tabs.main);

            self.navigateToHome = function () {
                window.history.pushState({}, "", "/");
                self.navigateToPath();
            };

            self.navigateToTag = function (tag) {
                window.history.pushState({}, "", "/tag/" + tag.name);
                self.navigateToPath();
            };

            self.navigateToPost = function (postId) {
                window.history.pushState({}, "", "/posts/" + postId);
                self.navigateToPath();
            };

            self.navigateToPath = function () {
                self.disposePageTitleSubscription();
                switch (self.appState.getPrimaryPath()) {
                    case self.appState.validPaths.home:
                        self.activeTab(self.tabs.home);
                        self.homeViewModel.loadPosts();
                        self.pageTitle("hitmanlabs: home");
                        break;
                    case self.appState.validPaths.tag:
                        self.activeTab(self.tabs.tag);
                        self.homeViewModel.loadPosts(self.appState.getPathId());
                        self.pageTitle("hitmanlabs: " + decodeURIComponent(self.appState.getPathId()));
                        break;
                    case self.appState.validPaths.post:
                        self.activeTab(self.tabs.post);
                        self.postViewModel.initialize(self.appState.getPathId());
                        self.pageTitleSubscription = self.postViewModel.post().title.subscribe(self.setPageTitleFromPostTitle);
                        break;
                    default:
                        self.activeTab(self.tabs.home);
                        self.homeViewModel.loadPosts();
                        self.pageTitle("hitmanlabs: home");
                        break;
                }
            };

            self.pageTitleSubscription = null;

            self.pageTitle = ko.observable("hitmanlabs");

            self.setAppTitle = ko.computed(function () {
                document.title = self.pageTitle();
            });
            
            self.setPageTitleFromPostTitle = function () {
                self.pageTitle("hitmanlabs: " + self.postViewModel.post().title());
            };

            self.disposePageTitleSubscription = function () {
                if (self.pageTitleSubscription != null)
                    self.pageTitleSubscription.dispose();
                self.pageTitleSubscription = null;
            };
        };
        return new singleton();
    }
);
define(['ko', 'utils'],
    function (ko, utils) {
        var singleton = function navigationService() {
            var self = this;

            self.onHistoryStateChanged = function () {
                self.navigateToPath();
            };

            window.addEventListener('popstate', self.onHistoryStateChanged, false);

            self.validPaths = {
                index: "index",
                home: "home",
                post: "post",
                tag: "tag"
            };

            self.primaryPath = ko.observable();
            self.secondaryPath = ko.observable();

            self.currentPath = ko.observable();

            self.getPrimaryPath = function () {
                var result = utils.getPrimaryPath();
                self.primaryPath(result);
                if (self.validPaths[result])
                    return result;

                return null;
            };

            self.getSecondaryPath = function () {
                var primaryPath = self.getPrimaryPath();
                if (primaryPath != null) {
                    result = utils.getPathEnd();
                    self.secondaryPath(result);
                    return result;
                }
            };

            self.parsePath = function () {
                self.getPrimaryPath();
                self.getSecondaryPath();
                self.currentPath(self.primaryPath() + "/" + self.secondaryPath());
            };

            self.tabs = {
                home: "home",
                post: "post",
                tag: "tag"
            };
            
            self.activeTab = ko.observable(self.tabs.home);

            self.navigateToHome = function () {
                window.history.pushState({}, "", "/");
                self.navigateToPath();
            };

            self.navigateToTag = function (tag) {
                window.history.pushState({}, "", "/tag/" + tag.name);
                self.navigateToPath();
            };

            self.navigateToPost = function (postId) {
                window.history.pushState({}, "", "/post/" + postId);
                self.navigateToPath();
            };


            self.pageTitle = ko.observable("hitmanlabs");


            self.navigateToPath = function () {

                self.parsePath();

                switch (self.getPrimaryPath()) {
                    case self.validPaths.home:
                        self.activeTab(self.tabs.home);
                        self.homeViewModel.loadPosts();
                        self.pageTitle("hitmanlabs: home");
                        break;
                    case self.validPaths.tag:
                        self.activeTab(self.tabs.tag);
                        //self.homeViewModel.loadPosts(self.getSecondaryPath());
                        self.pageTitle("hitmanlabs: " + decodeURIComponent(self.getSecondaryPath()));
                        break;
                    case self.validPaths.post:
                        self.activeTab(self.tabs.post);
                        //self.postViewModel.initialize(self.getSecondaryPath());
                        break;
                    default:
                        self.activeTab(self.tabs.home);
                        //self.homeViewModel.loadPosts();
                        self.pageTitle("hitmanlabs: home");
                        break;
                }
            };
        };
        return new singleton();
    }
);
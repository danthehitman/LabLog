define(['ko', 'utils', 'llapi', 'sessionService', 'postModel', 'navService'],
    function (ko, utils, llapi, sessionService, postModel, navService) {
        var singleton = function postViewModel() {
            var self = this;

            self.navService = navService;
            self.showPostContainer = ko.observable(false);

            self.onPathChanged = function () {
                if (self.navService.primaryPath() === self.navService.validPaths.post) {
                    if (self.navService.secondaryPath() !== null && self.navService.secondaryPath() !== "")
                    {
                        self.loadPost(self.navService.secondaryPath());
                    }
                }
            };

            self.post = ko.observable(new postModel());

            self.initialize = function () {
                self.navService.currentPath.subscribe(self.onPathChanged);
                return self;
            };

            self.loadPost = function (id) {
                self.showPostContainer(false);
                llapi.getPostById(id, self.onGetPostsSuccess, self.onGetPostError);
            };

            self.onGetPostsSuccess = function (result) {
                self.post().loadFromObject(result);
                self.showPostContainer(true);
                self.navService.pageTitle("hitmanlabs: " + self.post().title());
            };

            self.onGetPostError = function () {
                alert("error");
            };
        };
        return new singleton().initialize();
    });
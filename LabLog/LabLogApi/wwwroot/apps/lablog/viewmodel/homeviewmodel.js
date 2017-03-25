define(['ko', 'utils', 'llapi', 'sessionService', 'postModel', 'navService'],
    function (ko, utils, llapi, sessionService, postModel, navService) {
        var singleton = function homeViewModel() {
            var self = this;

            self.navService = navService;

            self.onPathChanged = function () {
                if (self.navService.primaryPath() === self.navService.validPaths.home || 
                    self.navService.primaryPath() === self.navService.validPaths.index ||
                    self.navService.primaryPath() === "")
                {
                    self.loadPosts();
                }
                else if (self.navService.primaryPath() === self.navService.validPaths.tag)
                {
                    if (self.navService.secondaryPath() !== null && self.navService.secondaryPath() !== "")
                    {
                        self.loadPosts(self.navService.secondaryPath());
                    }
                }
            };

            self.posts = ko.observableArray();

            self.initialize = function () {
                self.navService.currentPath.subscribe(self.onPathChanged);
                return self;
            };

            self.loadPosts = function (tag) {
                if (tag)
                    llapi.getPostsByTag([tag], self.onGetPostsSuccess, self.onError);
                else
                    llapi.getPosts(self.onGetPostsSuccess, self.onError);
            };

            self.getBodySummaryCss = function (postRecord) {
                return postRecord.getFirstImage() == null ? "llSummaryBodyContainerNoImage" : "llSummaryBodyContainer";
            };

            self.postTitleClicked = function (post) {
                if (post != null)
                    self.navService.navigateToPost(post.id());
            };

            self.onGetPostsSuccess = function (results) {
                var postModels = [];

                for (var i = 0; i < results.length; i++) {
                    var newPostModel = new postModel();
                    newPostModel.loadFromObject(results[i]);
                    postModels.push(newPostModel);
                }
                self.posts(postModels);
            };

            self.onError = function (message) {
                alert("Error: " + message);
            };
        };
        return new singleton().initialize();
    });
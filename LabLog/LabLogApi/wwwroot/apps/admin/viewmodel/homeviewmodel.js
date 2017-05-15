define(['ko', 'utils', 'llapi', 'sessionService', 'postModel', 'navState'],
    function (ko, utils, llapi, sessionService, postModel, navState) {
        var singleton = function homeViewModel() {
            var self = this;
            self.navState = navState;

            self.posts = ko.observableArray();

            self.initialize = function () {
                self.loadPosts();
                return self;
            };

            self.loadPosts = function (tag) {
                if (tag)
                    llapi.getPostsByTag([tag], self.onGetPostsSuccess, self.onError);
                else
                    llapi.getPosts(self.onGetPostsSuccess, self.onError);
            };

            self.postTitleClicked = function (post) {
                if (post != null) {
                    self.navState.activePost(post);
                    self.navState.activeTab(self.navState.tabs.postEditor);
                }
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
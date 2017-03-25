define(['ko', 'utils', 'llapi', 'sessionService', 'postModel'],
    function (ko, utils, llapi, sessionService, postModel) {
        return function homeViewModel() {
            var self = this;

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

            self.getBodySummaryCss = function (postRecord) {
                return postRecord.getFirstImage() == null ? "llSummaryBodyContainerNoImage" : "llSummaryBodyContainer";
            };

            self.postTitleClicked = function (post) {
                if (post != null)
                    window.location = "/post/" + post.id();
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
    });
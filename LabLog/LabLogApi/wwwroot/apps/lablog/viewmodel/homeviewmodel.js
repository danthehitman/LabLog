define(['ko', 'utils', 'llapi', 'sessionService', 'postModel'],
    function (ko, utils, llapi, sessionService, postModel) {
        return function homeViewModel() {
            var self = this;

            self.posts = ko.observableArray();

            self.initialize = function () {
                llapi.getPosts(self.onGetPostsSuccess, self.onGetPostError);
                return self;
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

            self.onGetPostError = function () {
                alert("error");
            };
        };
    });
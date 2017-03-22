define(['ko', 'utils', 'llapi', 'sessionService', 'postModel'],
    function (ko, utils, llapi, sessionService, postModel) {
        return function homeViewModel() {
            var self = this;

            self.posts = ko.observableArray();

            self.initialize = function () {
                llapi.getPosts(self.onGetPostsSuccess, self.onGetPostError);
                return self;
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
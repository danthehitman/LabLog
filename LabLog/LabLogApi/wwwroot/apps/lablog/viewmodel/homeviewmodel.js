define(['ko', 'utils', 'llapi', 'sessionService'],
    function (ko, utils, llapi, sessionService) {
        return function homeViewModel() {
            var self = this;

            self.posts = ko.observableArray();

            self.initialize = function () {
                llapi.getPosts(self.onGetPostsSuccess, self.onGetPostError);
                return self;
            };

            self.onGetPostsSuccess = function (results) {
                self.posts(results);
            };

            self.onGetPostError = function () {
                alert("error");
            };
        };
    });
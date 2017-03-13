define(['ko', 'utils', 'llapi', 'sessionService'],
    function (ko, utils, llapi, sessionService) {
        return function posts() {
            var self = this;

            self.posts = ko.observableArray();

            self.activate = function () {
                self.initialize();
            };

            self.initialize = function () {
                llapi.getPosts(self.onGetPostsSuccess, self.onGetPostError);
            };

            self.onGetPostsSuccess = function (results) {
                self.posts(results);
            };

            self.onGetPostError = function () {
                alert("error");
            };
        };
    });
define(['ko', 'utils', 'llapi', 'sessionService', 'postModel'],
    function (ko, utils, llapi, sessionService, postModel) {
        var singleton = function postViewModel() {
            var self = this;

            self.post = ko.observable(new postModel());

            self.initialize = function (id) {
                self.loadPost(id);
                return self;
            };

            self.loadPost = function (id) {
                llapi.getPostById(id, self.onGetPostsSuccess, self.onGetPostError);
            };

            self.onGetPostsSuccess = function (result) {
                self.post().loadFromObject(result);
            };

            self.onGetPostError = function () {
                alert("error");
            };
        };
        return new singleton();
    });
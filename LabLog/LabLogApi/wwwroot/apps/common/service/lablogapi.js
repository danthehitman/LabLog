define(['utils', 'appState'],
    function (utils, appState) {
        var singleton = function llapi() {
            var self = this;

            self.getPostTags = function (successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { },
                    url: '/api/posts/tags',
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };
            
            self.getPosts = function (successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: {},
                    url: '/api/posts',
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.getPostsByTag = function (tags, successCallback, errorCallback) {
                var tagsQuery = "";
                for (var i = 0; i < tags.length; i++) {
                    tagsQuery = tagsQuery + "tags=" +  tags[i];
                    if (i < tags.length - 1)
                        tagsQuery = tagsQuery + "&";
                }
                $.ajax({
                    type: 'GET',
                    headers: {},
                    url: '/api/posts?' + tagsQuery,
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.getPostById = function (id, successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": appState.sessionToken },
                    url: '/api/posts/' + id,
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.getImages = function (successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": appState.sessionToken },
                    url: '/api/images',
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.createPost = function (data, successCallback, errorCallback) {
                $.ajax({
                    headers: { "Authorization": appState.sessionToken},
                    type: "POST",
                    url: "/api/posts",
                    contentType: 'application/json',
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(data),
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.updatePost = function (data, successCallback, errorCallback) {
                $.ajax({
                    headers: { "Authorization": appState.sessionToken},
                    type: "PUT",
                    url: "/api/posts/" + data.id,
                    contentType: 'application/json',
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(data),
                    success: successCallback,
                    error: errorCallback
                });
            };
            
            self.getSessionByToken = function (token, successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    url: '/api/sessions/' + token,
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.uploadFiles = function (data, successCallback, errorCallback) {
                $.ajax({
                    headers: { "Authorization": appState.sessionToken },
                    type: "POST",
                    url: "/api/images",
                    contentType: false,
                    processData: false,
                    data: data,
                    success: successCallback,
                    error: errorCallback
                });
            };
        };
        return new singleton();
    }
);
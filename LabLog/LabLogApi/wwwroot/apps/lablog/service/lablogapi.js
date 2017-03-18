define(['utils', 'appState'],
    function (utils, appState) {
        var singleton = function llapi() {
            var self = this;
            
            self.getPosts = function (successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": appState.sessionToken },
                    url: '/api/posts',
                    async: true,
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
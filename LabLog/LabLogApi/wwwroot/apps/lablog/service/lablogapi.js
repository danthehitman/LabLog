define(['utils', 'appState'],
    function (utils, appState) {
        var singleton = function ilapi() {
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
        };
        return new singleton();
    }
);
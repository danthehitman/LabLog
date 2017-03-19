﻿define(['utils', 'appState'],
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

            self.createPost = function (data, successCallback, errorCallback) {
                $.ajax({
                    headers: { "Authorization": appState.sessionToken, "Content-Type": "application/json" },
                    type: "POST",
                    url: "/api/posts",
                    contentType: false,
                    processData: false,
                    data: JSON.stringify(data),
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.updatePost = function (data, successCallback, errorCallback) {
                $.ajax({
                    headers: { "Authorization": appState.sessionToken, "Content-Type": "application/json" },
                    type: "PUT",
                    url: "/api/posts/" + data.id,
                    contentType: false,
                    processData: false,
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
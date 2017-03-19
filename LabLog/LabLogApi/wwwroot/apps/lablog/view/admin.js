define(
    function (require) {
        return function home() {
            var self = this;
            var sessionService = require('sessionService');
            var llapi = require('llapi');

            self.uploadClick = function () {
                var fileUpload = $("#files").get(0);
                var files = fileUpload.files;
                var data = new FormData();
                for (var i = 0; i < files.length; i++) {
                    data.append(files[i].name, files[i]);
                }
                data.append("name", "ImageName");
                llapi.uploadFiles(data,
                    function (message) {
                        alert(message);
                    },
                    function () {
                        alert("There was error uploading files!");
                    }
                );
            };

            self.signInClick = function () {
                sessionService.initializeGoogleLogin();
                sessionService.initializeOfflineAccess();
            };

            self.signOutClick = function () {
                sessionService.disconnectFromGoogleSession();
            };
        };
});
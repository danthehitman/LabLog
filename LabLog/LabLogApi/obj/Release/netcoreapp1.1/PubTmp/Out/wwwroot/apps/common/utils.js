define([],
    function () {
        return function utils() {
            var self = this;

            self.storeCookie = function (key, value, expires) {
                var expiresValue = 360;
                if (expires) {
                    expiresValue = expires;
                }
                $.cookie(key, value, { expires: expiresValue, secure: true });
            };

            self.getCookie = function (key) {
                return $.cookie(key);
            };

            self.deleteCookie = function (key) {
                $.removeCookie(key);
            };

            // get a param value from the UIR by name.
            self.getUriParameterByName = function (name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            };

            //get the current host and protocol as a string.  e.g. https://dev.pipelinecloud.com
            self.getHostAndProtocolString = function () {
                return window.location.protocol + "//" + window.location.host;
            };

        }
    }
);
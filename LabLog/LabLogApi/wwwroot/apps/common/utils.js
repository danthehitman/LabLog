define([],
    function () {
        var singleton = function utils() {
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
            
            self.getHostAndProtocolString = function () {
                return window.location.protocol + "//" + window.location.host;
            };
            
            self.getPathEnd = function () {
                var path = window.location.pathname;
                return path.substring(path.lastIndexOf('/') + 1);
            };

            self.getPrimaryPath = function () {
                var path = window.location.pathname;
                var result = path.substring(path.indexOf('/') + 1);
                var lastSlashIndex = result.lastIndexOf('/');
                if (lastSlashIndex > 0)
                {
                    result = result.substring(0, lastSlashIndex);
                }
                return result;
            };
        };

        return new singleton();
    }
);
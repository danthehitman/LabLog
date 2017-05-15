define(['ko', 'cookies', 'utils'],
    function (ko, Cookies, utils) {
        var singleton = function appState() {
            var self = this;
            var sessionTokenKey = "lablogsessiontoken";

            self.sessionToken = null;
            self.activeSession = ko.observable(false);

            self.setSessionToken = function (token) {
                self.storeSessionCookie(token);
                self.sessionToken = token;
            };

            self.deleteSessionToken = function () {
                self.deleteSessionCookie();
                self.sessionToken = null;
            };

            self.storeSessionCookie = function (token) {
                Cookies.set(sessionTokenKey, token, { expires: 2 });
            };

            self.getSessionCookie = function () {
                return Cookies.get(sessionTokenKey);
            };

            self.deleteSessionCookie = function () {
                Cookies.remove(sessionTokenKey);
            };
        };
        return new singleton();
    }
);
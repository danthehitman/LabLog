define(['cookies'],
    function (Cookies) {
        var singleton = function appstate() {
            var self = this;
            var sessionTokenKey = "lablogsessiontoken";

            self.sessionToken = null;
            self.activeSession = false;

            self.setSessionToken = function (token) {
                self.storeSessionCookie(token);
                self.sessionToken = token;
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
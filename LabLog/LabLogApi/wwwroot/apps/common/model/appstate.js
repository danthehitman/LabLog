define(['ko', 'cookies', 'utils'],
    function (ko, Cookies, utils) {
        var singleton = function appState() {
            var self = this;
            var sessionTokenKey = "lablogsessiontoken";

            self.sessionToken = null;
            self.activeSession = false;

            self.validPaths = {
                home: "home",
                post: "post",
                tag: "tag"
            };

            self.primaryPath = ko.observable();

            self.getPrimaryPath = function () {
                var result = utils.getPrimaryPath();
                if (self.validPaths[result])
                    return result;

                return null;
            };

            self.getPathId = function () {
                var primaryPath = self.getPrimaryPath();
                if (primaryPath != null)
                {
                    return utils.getPathEnd();
                }
            };

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
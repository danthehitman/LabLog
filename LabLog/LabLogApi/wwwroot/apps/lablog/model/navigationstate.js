define(['ko', 'cookies'],
    function (ko, Cookies) {
        var singleton = function navigationState() {
            var self = this;

            self.tabs = {
                home: "home",
                post: "post",
                tag: "tag"
            };
            
            self.activeTab = ko.observable(self.tabs.main);

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
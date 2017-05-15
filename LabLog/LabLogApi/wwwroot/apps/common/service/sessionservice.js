define(['utils', 'appState', 'llapi'],
    function (utils, appState, llapi) {
        var singleton = function sessionservice() {
            var self = this;

            self.initialized = false;

            self.initialize = function() {
                if (appState.getSessionCookie() != null) {
                    llapi.getSessionByToken(appState.getSessionCookie(), self.onCheckActiveSessionSuccess, self.onCheckActiveSessionError);
                }
            };

            self.onCheckActiveSessionSuccess = function (result) {
                if (result != null && result.token == appState.getSessionCookie())
                {
                    appState.activeSession(true);
                    appState.setSessionToken(result.token);
                    console.log(result.token);
                }
                else {
                    self.onCheckActiveSessionError();
                }
            };

            self.onCheckActiveSessionError = function (result) {
                appState.activeSession(false);
                appState.deleteSessionCookie();
            };

            self.auth2 = self.auth2 || {};
            (function () {
                var po = document.createElement('script');
                po.type = 'text/javascript'; po.async = true;
                po.src = 'https://plus.google.com/js/client:plusone.js?onload=plusoneLoaded';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
            })();

            self.initializeGoogleLogin = function () {
                
                gapi.load('auth2', function () {
                    console.log("App Starting");

                    // Retrieve the singleton for the GoogleAuth library and setup the client.
                    gapi.auth2.init({
                        client_id: '552307546414-h58bp8klvjhlqua4u7t1d0jjl3tjr7i5.apps.googleusercontent.com',
                        cookiepolicy: 'single_host_origin',
                        ux_mode: 'redirect',
                        redirect_uri: 'dev.lablog.com:4724/anotherlogin',
                        fetch_basic_profile: true,
                        scope: 'https://www.googleapis.com/auth/plus.login'
                    }).then(function () {
                        console.log('init');
                        self.auth2 = gapi.auth2.getAuthInstance();
                        //self.auth2.then(function () {
                        //    self.onSignInCallback(self.auth2.currentUser.get().getAuthResponse())
                        //});
                    });
                });
            };

            self.onSignInCallback = function (authResult) {
                $.ajax({
                    type: 'POST',
                    url: $(location).attr('origin') + '/api/sessions/google',
                    contentType: 'application/json',
                    success: self.onSignInComplete,
                    error: self.onSignInFailure,
                    processData: false,
                    data: JSON.stringify({ "code": authResult })
                });
                console.log('authResult', authResult);
            };

            self.onSignInComplete = function (results) {
                appState.setSessionToken(results.token);
                appState.activeSession(true);
                console.log(results.token);
            };

            self.onSignInFailure = function (results) {
                self.disconnectFromGoogleSession();
            };

            self.checkPlusLoaded = function () {
                if (!gapi)
                    return;
                self.initialized = true;
            };

            self.initializeOfflineAccess = function () {
                self.auth2.grantOfflineAccess().then(
                    function (result) {
                        self.onSignInCallback(result.code);
                    });
            };

            self.disconnectFromGoogleSession = function () {
                self.auth2.disconnect().then(
                    appState.deleteSessionToken()
                );
            };

            window.plusoneLoaded = self.initializeGoogleLogin;
        };

        return new singleton();
    }
);

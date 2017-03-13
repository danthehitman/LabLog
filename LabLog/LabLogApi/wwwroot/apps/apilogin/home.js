define(
    function (require) {
        return function home() {
            var self = this;
            var app = require('durandal/app');
            var ko = require('knockout');

            self.auth2 = self.auth2 || {};
            (function () {
                var po = document.createElement('script');
                po.type = 'text/javascript'; po.async = true;
                po.src = 'https://plus.google.com/js/client:plusone.js?onload=plusoneLoaded';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
            })();

            self.plusoneLoaded = function () {
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
                        self.auth2.then(function () {
                                self.onSignInCallback(self.auth2.currentUser.get().getAuthResponse())
                            });
                    });
                });
            };

            window.plusoneLoaded = self.plusoneLoaded;

            self.name = ko.observable();
            self.signInClick = function () {
                //var signIn = function (result) {
                    //self.auth2.signIn().then(
                    //    function (googleUser) {
                    //        onSignInCallback(googleUser.getAuthResponse());
                    //    }, function (error) {
                    //        alert(JSON.stringify(error, undefined, 2));
                    //    });
                //};

                //var reauthorize = function () {
                self.auth2.grantOfflineAccess().then(
                        function (result) {
                            self.onSignInCallback(result.code);
                        });
                //};

               // helper.people(signIn, reauthorize);
            };

            self.signOutClick = function () {
                self.auth2.disconnect().then(
                    function () { console.log('User signed out.');}
                    );
            };

            self.onSignInCallback = function (authResult) {
                $.ajax({
                    type: 'POST',
                    url: $(location).attr('origin') + '/api/session/google',
                    contentType: 'application/json',
                    success: self.onSignInComplete,
                    error: self.onSignInComplete,
                    processData: false,
                    data: JSON.stringify({ "code": authResult })
                });
                //$('#authResult').html('Auth Result:<br/>');
                //for (var field in authResult) {
                //    $('#authResult').append(' ' + field + ': ' + authResult[field] + '<br/>');
                //}
                //if (authResult['access_token']) {
                //    // The user is signed in
                //    this.authResult = authResult;

                //    // After we load the Google+ API, render the profile data from Google+.
                //    gapi.client.load('plus', 'v1', this.renderProfile);

                //    // After we load the profile, retrieve the list of people visible to
                //    // this app, server-side.
                //    //helper.people();
                //} else if (authResult['error']) {
                //    // There was an error, which means the user is not signed in.
                //    // As an example, you can troubleshoot by writing to the console:
                //    console.log('There was an error: ' + authResult['error']);
                //    $('#authResult').append('Logged out');
                //    $('#authOps').hide('slow');
                //    $('#gConnect').show();
                //}
                console.log('authResult', authResult);
            };

            self.onSignInComplete = function (results) {
                console.log(results.token);
            };
        };
});
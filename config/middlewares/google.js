(function() {
    'use strict';
    /**
     * Module dependencies
     */
    module.exports = function(server) {
        server.auth.strategy('google', 'bell', {
            provider: 'google',
            password: 'password',
            isSecure: false,
            // You'll need to go to https://console.developers.google.com and set up an application to get started
            // Once you create your app, fill out "APIs & auth >> Consent screen" and make sure to set the email field
            // Next, go to "APIs & auth >> Credentials and Create new Client ID
            // Select "web application" and set "AUTHORIZED JAVASCRIPT ORIGINS" and "AUTHORIZED REDIRECT URIS"
            // This will net you the clientId and the clientSecret needed.
            // Also be sure to pass the location as well. It must be in the list of "AUTHORIZED REDIRECT URIS"
            // You must also enable the Google+ API in your profile.
            // Go to APIs & Auth, then APIs and under Social APIs click Google+ API and enable it.
            clientId: '',
            clientSecret: '',
            location: server.info.uri
        });
    }
}())

(function() {
    'use strict';
    /**
     * Module dependencies
     */
    module.exports = function(server) {
        server.auth.strategy('facebook', 'bell', {
            provider: 'facebook',
            password: 'password',
            isSecure: false,
            // You'll need to go to https://developers.facebook.com/ and set up a
            // Website application to get started
            // Once you create your app, fill out Settings and set the App Domains
            // Under Settings >> Advanced, set the Valid OAuth redirect URIs to include http://<yourdomain.com>/bell/door
            // and enable Client OAuth Login
            clientId: '',
            clientSecret: '',
            location: server.info.uri
        });
    }
}())

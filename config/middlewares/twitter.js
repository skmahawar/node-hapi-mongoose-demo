(function() {
    'use strict';
    /**
     * Module dependencies
     */
    module.exports = function(server) {
        server.auth.strategy('twitter', 'bell', {
            provider: 'twitter',
            password: 'password',
            isSecure: false,
            // Make sure to set a "Callback URL" and
            // check the "Allow this application to be used to Sign in with Twitter"
            // on the "Settings" tab in your Twitter application
            clientId: '', // Set client id
            clientSecret: '' // Set client secret
        });
    }
}())

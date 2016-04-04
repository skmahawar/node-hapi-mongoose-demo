(function() {
    'use strict';
    /**
     * Module dependencies
     */
    
    var config = require('../config');

    module.exports = function(server) {
        server.auth.strategy('twitter', 'bell', {
            provider: 'twitter',
            password: 'password',
            isSecure: false,
            // Make sure to set a "Callback URL" and
            // check the "Allow this application to be used to Sign in with Twitter"
            // on the "Settings" tab in your Twitter application
            clientId: config.twitter.clientId, // Set client id
            clientSecret: config.twitter.clientSecret // Set client secret
        });
    }
}())

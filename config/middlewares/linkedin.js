(function() {
    'use strict';
    /**
     * Module dependencies
     */
    module.exports = function(server) {
        server.auth.strategy('linkedin', 'bell', {
            provider: 'linkedin',
            password: 'password',
            isSecure: false,
            // You'll need to go to https://www.linkedin.com/secure/developer?newapp= and set up an application to get started
            // Follow the instructions on https://developer.linkedin.com/docs/oauth2 to setup redirect_uri and default scopes
            clientId: '',
            clientSecret: '',
            providerParams: {
                redirect_uri: server.info.uri + '/bell/door'
            }
        });
    }
}())

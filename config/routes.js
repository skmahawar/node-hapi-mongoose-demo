(function() {
    'use strict';
    /**
     * Module dependencies
     */
    var users = require('../routes/users');
    var config = require('./config');
    var authenticate = require('./middlewares/authenticate');
    var facebook = require('./middlewares/facebook');
    var google = require('./middlewares/google');
    var linkedin = require('./middlewares/linkedin');
    var twitter = require('./middlewares/twitter');

    /**
     * Routes initialize
     * @param  {[type]} server [description]
     * @return {[type]}        [description]
     */
    module.exports = function(server) {
        server.auth.strategy('token', 'jwt', 'optional', {
            key: config.secretKey,
            //validateFunc: authenticate.requiresLogin,
            verifyOptions: {
                algorithms: ['HS256']
            }
        });
        
        facebook(server);
        google(server);
        linkedin(server);
        twitter(server);

        server.route(users);
    };

}());

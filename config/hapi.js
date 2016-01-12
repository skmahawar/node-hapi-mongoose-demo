(function() {
    'use strict';
    /**
     * Module dependencies
     */
    var GoodWinston = require('good-winston');
    var winston = require('../winston');

    /**
     * [exports description]
     * @param  {[type]}   server   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    module.exports = function(server, callback) {

        server.ext('onRequest', function(request, reply) {
            return reply.continue();
        });

        server.ext('onPreAuth', function(request, reply) {
            return reply.continue();
        });

        server.ext('onPostAuth', function(request, reply) {
            return reply.continue();
        });

        server.register([{
            register: require('bell'),
            options: {}
        }, {
            register: require('hapi-auth-jwt'),
            options: {}
        }, {
            register: require('scooter'),
            options: {}
        }, {
            register: require('good'),
            options: {
                opsInterval: 1000,
                reporters: [
                    new GoodWinston({
                        //ops: '*',
                        request: '*',
                        response: '*',
                        log: '*',
                        error: '*'
                    }, winston)
                ]
            }
        }], callback);
    }
}())

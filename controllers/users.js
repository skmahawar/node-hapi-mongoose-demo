(function() {
    'use strict';
    /**
     * Module dependencies
     */
    var mongoose = require('mongoose');
    var User = mongoose.model('User');
    var users = require('../services/users');
    var winston = require('../winston');

    exports.load = function(request, reply) {
        var userId = request.auth.credentials.user_id;
        var options = {
            criteria: {
                _id: userId
            }
        };
        User.load(options, function(err, user) {
            if (err) return reply(err);
            if (!user) return reply(new Error('Failed to load User ' + userId));
            request.profile = user;
            request.continue();
        });
    };

    /**
     * [register description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.register = function(request, reply) {
        winston.info(request.payload);
        var user = new User(request.payload);
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                return reply({
                    success: false
                });
            }
            reply({
                success: true
            });
        });
    };

    /**
     * [login description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.login = function(request, reply) {
        winston.info(request.payload);
        reply(request.payload);
    };

    /**
     * [logout description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.logout = function(request, reply) {
        winston.info(new Date());
        reply({
            success: true
        });
    };

    /**
     * [profile description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.profile = function(request, reply) {
        winston.info(request.params.userId);
        reply(request.payload);
    };

    /**
     * [editProfile description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.editProfile = function(request, reply) {
        winston.info(request.params.userId);
        reply(request.payload);
    };

}());

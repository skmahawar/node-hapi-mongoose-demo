(function() {
    'use strict';
    /**
     * Module dependencies
     */
    var Boom = require('boom');
    var redis = require("redis");
    var client = redis.createClient();
    var users = require('../services/users');
    var jsonwebtoken = require("jsonwebtoken");
    var TOKEN_EXPIRATION = 60 * 60;
    var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;
    var winston = require('../winston');
    var authenticate = require('../config/middlewares/authenticate');

    /**
     * [Login with Facebook description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.loginWithFacebook = function(request, reply) {

        if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
        }
        return reply.redirect('/users/me');
    };

    /**
     * [Login with Google description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.loginWithGoogle = function(request, reply) {

        if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
        }
        return reply.redirect('/users/me');
    };


    /**
     * [Login with Linkedin description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.loginWithLinkedin = function(request, reply) {

        if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
        }
        return reply.redirect('/users/me');
    };


    /**
     * [Login with Twitter description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.loginWithTwitter = function(request, reply) {

        if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
        }
        return reply.redirect('/users/me');
    };

    /**
     * [register description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.register = function(request, reply) {
        winston.info(request.payload);
        users.create(request.payload, function(err, user) {
            if (err) {
                return reply(Boom.badRequest(err));
            }
            authenticate.createToken(user, function(err, data) {
                if (err) {
                    return reply(Boom.badRequest(err));
                }
                reply({
                    success: true,
                    token: data.token
                });
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
        var email = request.payload.email;
        var password = request.payload.password;
        users.loadByEmail(email, function(err, user) {
            if (!user.authenticate(password)) {
                return reply(Boom.badRequest("Invalid username or password"));
            }
            authenticate.createToken(user, function(err, data) {
                if (err) {
                    return reply(Boom.badRequest(err));
                }
                reply({
                    success: true,
                    token: data.token
                });
            });
        });
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
            success: authenticate.expire(request.headers)
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
        var userId = request.params.userId;
        if (userId === 'me')
            userId = request.auth.credentials.user_id;
        if (!userId) return reply(Boom.unauthorized("Unauthorized user"));
        users.loadByUserId(userId, function(err, user) {
            if (err) {
                return reply(Boom.badRequest(err));
            }
            reply(user);
        });
    };

    /**
     * [editProfile description]
     * @param  {[type]} request [description]
     * @param  {[type]} reply   [description]
     * @return {[type]}         [description]
     */
    exports.editProfile = function(request, reply) {
        var userId = request.auth.credentials.user_id;
        users.edit(userId, request.payload, function(err, user) {
            if (err) {
                return reply(Boom.badRequest(err));
            }
            reply(user);
        });
    };

}());

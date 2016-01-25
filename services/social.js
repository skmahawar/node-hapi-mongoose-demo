(function() {
    'use strict';
    /**
     * Module dependencies
     */
    var request = require('request');
    var moment = require('moment');
    var Async = require('async');
    var winston = require('../winston');
    var config = require('../config/config');

    /**
     * [Login with Facebook description]
     * @param  {[type]}   payload  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.facebook = function(payload, callback) {
        var url = 'https://graph.facebook.com/me?access_token=' + payload.access_token;
        request(url, function(err, response, body) {

            if (err || response.statusCode !== 200) {
                return callback(err);
            } else {
                try {
                    body = JSON.parse(body);
                } catch (err) {
                    return callback(err);
                }
                winston.info(body);
                var user = _.pick(body, 'first_name', 'last_name', 'gender', 'birthday', 'email');
                user.facebook = body;
                user.provider = 'facebook';
                if (user.email) {
                    user.email_verified = true;
                }
                if (user.birthday) {
                    user.birthday = moment(new Date(user.birthday));
                }

                callback(null, user);
            }
        });
    };

    /**
     * [Login with Google description]
     * @param  {[type]}   payload  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.google = function(payload, callback) {
        var url = 'https://graph.facebook.com/me?access_token=' + payload.access_token;
        request(url, function(err, response, body) {

            if (err || response.statusCode !== 200) {
                return callback(err);
            } else {
                try {
                    body = JSON.parse(body);
                } catch (err) {
                    return callback(err);
                }
                winston.info(body);
                var user = _.pick(body, 'first_name', 'last_name', 'gender', 'birthday', 'email');
                user.facebook = body;
                if (user.email) {
                    user.email_verified = true;
                }
                if (user.birthday) {
                    user.birthday = moment(new Date(user.birthday));
                }

                callback(null, user);
            }
        });
    };

    /**
     * [Login with Linkedin description]
     * @param  {[type]}   payload  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.linkedin = function(payload, callback) {
        var url = 'https://graph.facebook.com/me?access_token=' + payload.access_token;
        request(url, function(err, response, body) {

            if (err || response.statusCode !== 200) {
                return callback(err);
            } else {
                try {
                    body = JSON.parse(body);
                } catch (err) {
                    return callback(err);
                }
                winston.info(body);
                var user = _.pick(body, 'first_name', 'last_name', 'gender', 'birthday', 'email');
                user.facebook = body;
                if (user.email) {
                    user.email_verified = true;
                }
                if (user.birthday) {
                    user.birthday = moment(new Date(user.birthday));
                }

                callback(null, user);
            }
        });
    };

    /**
     * [Login with Twitter description]
     * @param  {[type]}   payload  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.twitter = function(payload, callback) {
        var url = 'https://graph.facebook.com/me?access_token=' + payload.access_token;
        request(url, function(err, response, body) {

            if (err || response.statusCode !== 200) {
                return callback(err);
            } else {
                try {
                    body = JSON.parse(body);
                } catch (err) {
                    return callback(err);
                }
                winston.info(body);
                var user = _.pick(body, 'first_name', 'last_name', 'gender', 'birthday', 'email');
                user.facebook = body;
                if (user.email) {
                    user.email_verified = true;
                }
                if (user.birthday) {
                    user.birthday = moment(new Date(user.birthday));
                }

                callback(null, user);
            }
        });
    };

    /**
     * [custom description]
     * @param  {[type]}   payload  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.custom = function(payload, callback) {
    	return payload;
    }
}())

(function() {
    'use strict';
    /**
     * Module dependencies
     */
    var request = require('request');
    var config = require('../config/config');
    var moment = require('moment');
    var Async = require('async');
    var google = require('googleapis');
    var OAuth2 = google.auth.OAuth2;
    var plus = google.plus('v1');
    var oauth2Client = new OAuth2(config.google.clientID, config.google.clientSecret, config.google.callbackURL);
    var winston = require('../winston');
    var config = require('../config/config');


    exports.refreshToken = function(type, accessToken) {
        switch (type) {
            case 'facebook':
                {
                    var url = 'https://graph.facebook.com/oauth/access_token?client_id=APP_ID&client_secret=APP_SECRET&grant_type=fb_exchange_token&fb_exchange_token=EXISTING_ACCESS_TOKEN';
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
                break;
            case 'google':
                {

                };
                break;
        }
    }

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
        var OAuth2 = google.auth.OAuth2;
        oauth2Client.getToken(payload.access_token, function(err, tokens) {
            // Now tokens contains an access_token and an optional refresh_token. Save them.
            if (err) {
                return callback(err);
            }
            oauth2Client.setCredentials(tokens);
            plus.people.get({
                userId: 'me',
                auth: oauth2Client
            }, function(err, response) {
                // handle err and response
            });
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

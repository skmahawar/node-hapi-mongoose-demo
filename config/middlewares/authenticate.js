(function() {
    'use strict';
    /**
     * Module dependencies
     */
    var path = require('path');
    var util = require('util');
    var redis = require("redis");
    var client = redis.createClient();
    var config = require("../config");
    var jsonwebtoken = require("jsonwebtoken");
    var TOKEN_EXPIRATION = 60 * 60;
    var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;
    var winston = require('../../winston');


    client.on('error', winston.error);

    client.on('connect', function() {
        winston.info("Redis successfully connected");
    });

    /**
     * [fetch description]
     * @param  {[type]} headers [description]
     * @return {[type]}         [description]
     */
    function fetch(headers) {
        if (headers && headers.authorization) {
            var authorization = headers.authorization;
            var part = authorization.split(' ');
            if (part.length === 2) {
                var token = part[1];
                return part[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    /**
     * [retrieve description]
     * @param  {[type]}   id   [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    function retrieve(id, done) {

        winston.info("Calling retrieve for token:", id);

        if (_.isNull(id)) {
            return done(new Error("token_invalid"));
        }

        client.get(id, function(err, reply) {
            if (err) {
                return done(err);
            }

            if (_.isNull(reply)) {
                return done(new Error("Token doesn't exists, are you sure it hasn't expired or been revoked?"));
            } else {
                var data = JSON.parse(reply);
                winston.info("User data fetched from redis store for user: %s", data.username);

                if (_.isEqual(data.token, id)) {
                    return done(null, data);
                } else {
                    return done(new Error("Token doesn't exists, login into the system so it can generate new token."));
                }
            }
        });
    };

    /**
     * [expire description]
     * @param  {[type]} headers [description]
     * @return {[type]}         [description]
     */
    function expire(headers) {

        var token = fetch(headers);

        winston.info("Expiring token: %s", token);

        if (token !== null) {
            client.expire(token, 0);
        }
        return token !== null;
    };

    /**
     * [create description]
     * @param  {[type]}   user     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.createToken = function(user, callback) {
        winston.info("Create token");
        if (_.isEmpty(user)) {
            return callback(new Error("User data cannot be empty."));
        }
        user.token = jsonwebtoken.sign({
            user_id: user._id,
            first_name: user.first_name,
            username: user.username
        }, config.secretKey, {
            algorithm: 'HS256',
            expiresInMinutes: TOKEN_EXPIRATION
        });

        var decoded = jsonwebtoken.decode(user.token);

        var data = _.pick(user, 'email', 'username', '_id', 'first_name', 'token', 'provider');
        data.token_exp = decoded.exp;
        data.token_iat = decoded.iat;

        winston.info("Token generated for user: %s, token: %s", user.username, data.token);

        client.set(data.token, JSON.stringify(data), function(err, reply) {
            if (err) {
                return callback(err);
            }
            if (!reply) return callback(new Error("Token not set in redis"));

            client.expire(data.token, TOKEN_EXPIRATION_SEC, function(err, reply) {
                if (err) {
                    return callback(new Error("Can not set the expire value for the token key"));
                }
                if (reply) {
                    return callback(null, data); // we have succeeded
                } else {
                    return callback(new Error("Expiration not set on redis"));
                }
            });
        });
    };

    /**
     * [verify description]
     * @param  {[type]}   headers  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.verify = function(headers, callback) {

        winston.info("Verifying token");

        var token = fetch(headers);

        jsonwebtoken.verify(token, config.secret, function(err, decode) {
            if (err) {
                return callback(new Error("invalid_token"));
            }
            retrieve(token, function(err, data) {
                if (err) {
                    return callback(new Error("Invalid Token"));
                }
                callback(null, data);
            });

        });
    };


    exports.requiresLogin = function(request, decodedToken, callback) {
        var token = fetch(request.headers);
        retrieve(token, function(err, data) {
            if (err) {
                return callback(err, false);
            }
            if (!data) {
                return callback(err, false);
            }
            return callback(err, true, data);
        });
    };


}())

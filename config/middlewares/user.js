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

        winston.info("Calling retrieve for token: %s", id);

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
    exports.create = function(request, reply) {
        var data = request.payload;
        var user = new User(data);
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                return reply(err);
            }
            winston.info("Create token");
            if (_.isEmpty(user)) {
                return reply(new Error("User data cannot be empty."));
            }
            data.token = jsonwebtoken.sign({
                _id: user._id,
                name: user.name,
                username: user.username
            }, config.secretKey, {
                expiresInMinutes: TOKEN_EXPIRATION
            });

            var decoded = jsonwebtoken.decode(data.token);

            data.token_exp = decoded.exp;
            data.token_iat = decoded.iat;

            winston.info("Token generated for user: %s, token: %s", data.username, data.token);

            client.set(data.token, JSON.stringify(data), function(err, reply) {
                if (err) {
                    return reply(err);
                }
                if (!reply) return reply(new Error("Token not set in redis"));

                client.expire(data.token, TOKEN_EXPIRATION_SEC, function(err, reply) {
                    if (err) {
                        return reply(new Error("Can not set the expire value for the token key"));
                    }
                    if (reply) {
                        request.data = data;
                        return request.continue(); // we have succeeded
                    } else {
                        return reply(new Error("Expiration not set on redis"));
                    }
                });
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

    exports.requiresLogin = function(request, reply) {
        var token = fetch(request.headers);
        retrieve(token, function(err, data) {

            if (err) {
                req.user = undefined;
                return reply(new Error("Invalid Token"));
            }
            request.data = data;
            request.continue();
        });
    };


}())

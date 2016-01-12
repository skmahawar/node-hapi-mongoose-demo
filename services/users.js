(function() {
    'use strict';
    /**
     * Module dependencies
     * @type {[type]}
     */
    var mongoose = require('mongoose');
    var User = mongoose.model('User');

    /**
     * [load description]
     * @param  {[type]} userId [description]
     * @param  {[type]} callback   [description]
     * @return {[type]}         [description]
     */
    exports.loadByUserId = function(userId, callback) {
        var options = {
            criteria: {
                _id: userId
            }
        };
        User.load(options, function(err, user) {
            if (err) return callback(err);
            if (!user) return callback(new Error('Failed to load User ' + userId));
            callback(null, user);
        });
    };

    /**
     * create new user
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.create = function(data, callback) {
        var user = new User(data);
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, user);
        });
    };

    /**
     * [loadByEmail description]
     * @param  {[type]}   email    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.loadByEmail = function(email, callback) {
        var options = {
            criteria: {
                "$or": [{
                    email: email
                }, {
                    username: email
                }]
            }
        };
        User.load(options, function(err, user) {
            if (err || !user) {
                return callback(new Error("Invalid username or password"));
            }
            callback(null, user);
        });
    };

    exports.edit = function(userId, data, callback) {
        var options = {
            criteria: {
                _id: userId
            }
        };
        User.load(options, function(err, user) {
            if (err) return callback(err);
            if (!user) return callback(new Error('Failed to load User ' + userId));
            var update = _.pick(data, 'first_name', 'last_name');
            user = _.extend(user, update);
            user.save(function(err) {
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
    };

}());

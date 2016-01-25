(function() {
    'use strict';

    /**
     * Module dependencies.
     */

    var mongoose = require('mongoose');
    var crypto = require('crypto');

    var Schema = mongoose.Schema;
    var oAuthTypes = [
        'github',
        'twitter',
        'facebook',
        'google',
        'linkedin'
    ];

    /**
     * User Schema
     */

    var UserSchema = new Schema({
        first_name: {
            type: String,
            default: ''
        },
        last_name: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            index: true
        },
        email_verified: {
            type: Boolean,
            default: false
        },
        contact: {
            primary: {
                type: String,
                index: true
            },
            secondary: [String]
        },
        contact_verified: {
            type: Boolean,
            default: false
        },
        username: {
            type: String,
            required: true,
            index: true
        },
        birthday: {
            type: Date
        },
        gender: {
            type: String
        },
        provider: {
            type: String,
            default: 'custom'
        },
        hashed_password: {
            type: String,
            default: ''
        },
        salt: {
            type: String,
            default: ''
        },
        authToken: {
            type: String,
            default: ''
        },
        facebook: {},
        twitter: {},
        github: {},
        google: {},
        linkedin: {},
        created: {
            type: Date,
            default: Date.now
        },
        modified: {
            type: Date
        }
    });

    var validatePresenceOf = function(value) {
        return value && value.length;
    };

    /**
     * Virtuals
     */

    UserSchema
        .virtual('password')
        .set(function(password) {
            this._password = password;
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
        })
        .get(function() {
            return this._password;
        });

    /**
     * Validations
     */

    // the below 5 validations only apply if you are signing up traditionally

    UserSchema.path('first_name').validate(function(first_name) {
        if (this.skipValidation()) return true;
        return first_name.length;
    }, 'Name cannot be blank');

    UserSchema.path('email').validate(function(email) {
        if (this.skipValidation()) return true;
        return email.length;
    }, 'Email cannot be blank');

    UserSchema.path('email').validate(function(email, fn) {
        var User = mongoose.model('User');
        if (this.skipValidation()) fn(true);

        // Check only when it is a new user or when email field is modified
        if (this.isNew || this.isModified('email')) {
            User.find({
                email: email
            }).exec(function(err, users) {
                fn(!err && users.length === 0);
            });
        } else fn(true);
    }, 'Email already exists');

    UserSchema.path('username').validate(function(username) {
        if (this.skipValidation()) return true;
        return username.length;
    }, 'Username cannot be blank');


    UserSchema.path('hashed_password').validate(function(hashed_password) {
        if (this.skipValidation()) return true;
        return hashed_password.length && this._password.length;
    }, 'Password cannot be blank');


    /**
     * Pre-save hook
     */

    UserSchema.pre('save', function(next) {
        if (this.created) {
            this.modified = new Date();
        }
        if (!this.isNew) return next();

        if (!validatePresenceOf(this.password) && !this.skipValidation()) {
            next(new Error('Invalid password'));
        } else {
            next();
        }
    });

    /**
     * Methods
     */

    UserSchema.methods = {

        /**
         * Authenticate - check if the passwords are the same
         *
         * @param {String} plainText
         * @return {Boolean}
         * @api public
         */

        authenticate: function(plainText) {
            return this.encryptPassword(plainText) === this.hashed_password;
        },

        /**
         * Make salt
         *
         * @return {String}
         * @api public
         */

        makeSalt: function() {
            return Math.round((new Date().valueOf() * Math.random())) + '';
        },

        /**
         * Encrypt password
         *
         * @param {String} password
         * @return {String}
         * @api public
         */

        encryptPassword: function(password) {
            if (!password) return '';
            try {
                return crypto
                    .createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex');
            } catch (err) {
                return '';
            }
        },

        /**
         * Validation is not required if using OAuth
         */

        skipValidation: function() {
            return ~oAuthTypes.indexOf(this.provider);
        }
    };

    /**
     * Statics
     */

    UserSchema.statics = {

        /**
         * Load
         *
         * @param {Object} options
         * @param {Function} cb
         * @api private
         */

        load: function(options, cb) {
            options.select = options.select || 'first_name last_name _id provider email username ';
            return this.findOne(options.criteria)
                .select(options.select)
                .exec(cb);
        }
    };

    mongoose.model('User', UserSchema);

}())

(function() {
    'use strict';
    /**
     * Module dependencies
     */
    var users = require('../handlers/users');
    var Joi = require('joi');

    /**
     * User routes
     * @type {Array}
     */
    //deviceId: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    module.exports = [{
            method: 'POST',
            path: '/register',
            handler: users.register,
            config: {
                auth: false,
                validate: {
                    payload: {
                        type: Joi.string().valid('facebook', 'google', 'custom').required(),
                        access_token: Joi.string().when('type', {
                            is: ['facebook', 'google'],
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        first_name: Joi.string().when('type', {
                            is: 'custom',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        last_name: Joi.string().when('type', {
                            is: 'custom',
                            then: Joi.required()
                        }),
                        email: Joi.string().email().when('type', {
                            is: 'custom',
                            then: Joi.required(),
                            otherwise: Joi.string().valid(Joi.ref('contact.primary').required())
                        }),
                        contact: Joi.object({
                            primary: Joi.string().when('type', {
                                is: 'custom',
                                then: Joi.required(),
                                otherwise: Joi.string().valid(Joi.ref('email').required())
                            })
                        }),
                        password: Joi.string().min(3).max(30).when('type', {
                            is: 'custom',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        password_confirmation: Joi.string().when('type', {
                            is: 'custom',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }).valid(Joi.ref('password')).options({
                            language: {
                                any: {
                                    allowOnly: 'must match password'
                                }
                            }
                        }),
                        username: Joi.string().default(function(context) {
                            var max = 2999,
                                min = 1000;
                            return context.first_name.toLowerCase() + '-' + context.last_name.toLowerCase() + Math.floor(Math.random() * (max - min + 1) + min);
                        })
                    }
                },
                pre: [method: users.socialProfile, assign: 'user']
            }
        },

        {
            method: 'POST',
            path: '/login',
            handler: users.login,
            config: {
                auth: false,
                validate: {
                    payload: {
                        type: Joi.string().valid('facebook', 'google', 'linkedin', 'twitter', 'custom', 'device').required(),
                        access_token: Joi.string().when('login_type', {
                            is: ['facebook', 'google', 'linkedin', 'twitter'],
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        username: Joi.string().when('type', {
                            is: 'custom',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        password: Joi.string().when('type', {
                            is: 'custom',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        })
                    }
                }
            }
        },

        {
            method: 'GET',
            path: '/logout',
            handler: users.logout,
            config: {
                auth: {
                    strategy: 'token'
                }
            }
        },

        {
            method: 'GET',
            path: '/users/{userId}',
            handler: users.profile,
            config: {
                auth: 'token',
                validate: {
                    params: {
                        userId: Joi.alternatives().try(Joi.string().valid('me'), Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required()
                    }
                }
            }
        },

        {
            method: 'PUT',
            path: '/users/{userId}',
            handler: users.editProfile,
            config: {
                auth: 'token',
                validate: {
                    params: {
                        userId: Joi.alternatives().try(Joi.string().valid('me'), Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required()
                    },
                    payload: {
                        first_name: Joi.string(),
                        last_name: Joi.string()
                    }
                }
            }
        }
    ];
}());

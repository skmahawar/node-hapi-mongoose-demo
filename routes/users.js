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
    module.exports = [{
            method: ['GET', 'POST'],
            path: '/auth/facebook',
            config: {
                auth: 'facebook',
                handler: users.loginWithFacebook
            }
        }, {
            method: ['GET', 'POST'],
            path: '/auth/google',
            config: {
                auth: 'google',
                handler: users.loginWithGoogle
            }
        }, {
            method: ['GET', 'POST'],
            path: '/auth/linkedin',
            config: {
                auth: 'linkedin',
                handler: users.loginWithLinkedin
            }
        }, {
            method: ['GET', 'POST'],
            path: '/auth/twitter',
            config: {
                auth: 'twitter',
                handler: users.loginWithTwitter
            }
        }, {
            method: 'POST',
            path: '/users/register',
            handler: users.register,
            config: {
                auth: {
                    strategy: 'token',
                    mode: 'optional'
                },
                validate: {
                    payload: {
                        login_type: Joi.string().valid('facebook', 'google', 'email', 'phone', 'device').required(),
                        facebook_access_token: Joi.string().when('login_type', {
                            is: 'facebook',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        google_access_token: Joi.string().when('login_type', {
                            is: 'google',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        email: Joi.string().email().when('login_type', {
                            is: 'email',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        first_name: Joi.string().when('login_type', {
                            is: ['email', 'phone'],
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        password: Joi.string().min(3).max(30).when('login_type', {
                            is: ['email', 'phone'],
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        password_confirmation: Joi.string().when('login_type', {
                            is: ['email', 'phone'],
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }).valid(Joi.ref('password')).options({
                            language: {
                                any: {
                                    allowOnly: 'must match password'
                                }
                            }
                        }),
                        deviceId: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).when('login_type', {
                            is: 'device',
                            then: Joi.required()
                        }),
                        phone: Joi.string().when('login_type', {
                            is: 'phone',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        })
                    }
                }
            }
        },

        {
            method: 'POST',
            path: '/users/login',
            handler: users.login,
            config: {
                auth: {
                    strategy: 'token',
                    mode: 'optional'
                },
                validate: {
                    payload: {
                        login_type: Joi.string().valid('facebook', 'google', 'email', 'phone', 'device').required(),
                        facebook_access_token: Joi.string().when('login_type', {
                            is: 'facebook',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        google_access_token: Joi.string().when('login_type', {
                            is: 'google',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        email: Joi.string().email().when('login_type', {
                            is: 'email',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        password: Joi.string().when('login_type', {
                            is: ['email', 'phone'],
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        deviceId: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).when('login_type', {
                            is: 'device',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        }),
                        phone: Joi.string().when('login_type', {
                            is: 'phone',
                            then: Joi.required(),
                            otherwise: Joi.forbidden()
                        })
                    }
                }
            }
        },

        {
            method: 'GET',
            path: '/users/logout',
            handler: users.logout,
            config: {
                auth: {
                    strategy: 'token'
                },
                validate: {
                    params: {

                    }
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
                    }
                }
            }
        }
    ];
}());

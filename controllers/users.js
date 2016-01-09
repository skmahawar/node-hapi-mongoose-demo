(function(){
	'use strict';
	/**
	 * Module dependencies
	 */
	var users = require('../services/users');
	var winston = require('../winston');

	/**
	 * [register description]
	 * @param  {[type]} request [description]
	 * @param  {[type]} reply   [description]
	 * @return {[type]}         [description]
	 */
	exports.register = function(request, reply){
		winston.info(request.payload);
		reply(request.payload);
	};

	/**
	 * [login description]
	 * @param  {[type]} request [description]
	 * @param  {[type]} reply   [description]
	 * @return {[type]}         [description]
	 */
	exports.login = function(request, reply){
		winston.info(request.payload);
		reply(request.payload);
	};

	/**
	 * [logout description]
	 * @param  {[type]} request [description]
	 * @param  {[type]} reply   [description]
	 * @return {[type]}         [description]
	 */
	exports.logout = function(request, reply){
		winston.info(new Date());
		reply({success: true});
	};

	/**
	 * [profile description]
	 * @param  {[type]} request [description]
	 * @param  {[type]} reply   [description]
	 * @return {[type]}         [description]
	 */
	exports.profile = function(request, reply){
		winston.info(request.params.userId);
		reply(request.payload);
	};

	/**
	 * [editProfile description]
	 * @param  {[type]} request [description]
	 * @param  {[type]} reply   [description]
	 * @return {[type]}         [description]
	 */
	exports.editProfile = function(request, reply){
		winston.info(request.params.userId);
		reply(request.payload);
	};

}())
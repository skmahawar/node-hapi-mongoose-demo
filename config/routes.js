(function(){
	'use strict';
	/**
	 * Module dependencies
	 */
	var users = require('../routes/users');

	/**
	 * Routes initialize
	 * @param  {[type]} server [description]
	 * @return {[type]}        [description]
	 */
	module.exports = function(server){
		server.route(users);
	};

}());
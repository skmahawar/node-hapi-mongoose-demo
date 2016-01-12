(function() {
    'use strict';
    /**
     * Module dependencies
     */
    GLOBAL._ = require('underscore');
    var fs = require('fs');
    var join = require('path').join;
    var Hapi = require('hapi');
    var mongoose = require('mongoose');
    var winston = require('./winston');
    var config = require('./config/config');
    var models = join(__dirname, './models');
    var port = process.env.PORT || 3000;

    process.on('uncaughtException', function(err) {
        winston.error('Uncaught exception', err);

        process.exit(1);
    });

    // Connect to mongodb
    var connect = function() {
        var options = {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        };
        mongoose.connect(config.db, options);
    };
    connect();

    mongoose.connection.on('error', winston.error);
    mongoose.connection.on('disconnected', connect);
    mongoose.connection.on('open', listen);

    // Bootstrap models
    fs.readdirSync(join(__dirname, './models')).forEach(function(file) {
        if (~file.indexOf('.js')) require(join(__dirname, './models', file));
    });

    function listen() {
        var server = new Hapi.Server();
        server.connection({
            port: port
        });
        require('./config/hapi')(server, function registerCallback(err) {
            if (err) {
                winston.error(err);
                throw err;
            }
            require('./config/routes')(server);
        });
        server.start(function() {
            winston.info('Hapi API server started at', server.info.uri);
        });
    }

}());

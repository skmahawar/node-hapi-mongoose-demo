(function() {
    'use strict';
    var request = require("request");
    var config = require('../config/config');
    var winston = require('../winston');

    exports.reportIt = function(errors, data, email) {
        var option = {
            url: config.notifier.url,
            form: {
                event: "sample-error",
                email: {
                    errors: errors,
                    data: data
                }
            }
        }
        if(email){
        	option.form.email.email = email;
        }
        if (process.env.NODE_ENV === 'production') {
            request.post(option, function(err, res, body) {
                if (err) {
                    winston.info(err);
                }
                winston.info(body);
            });
        }else{

        }
    }
}());

'use strict';

var util = require('util');
var nconf = require('nconf');
var modulestore = require('edx-modulestore');

// ## //

nconf
    .argv()
    .file({ file: __dirname + '/config.json' })
    .defaults({
        environment: process.env.NODE_ENV || 'development',
        host: 'localhost',
        port: 6500,
        url: 'http://localhost:6500',
        modulestore: {
            mongo: {
                uri: '192.168.33.10/edxapp'
            },
            settings: {
                lmsUrl: 'http://localhost:8000',
                studioUrl: 'http://localhost:8001',
                aboutFields: [
                    'short_description',
                    'overview'
                ]
            },
            retryInterval: 500
        }
    });


var app = require('./lib/app');

var connect = function () {
    modulestore
        .connect(nconf.get('modulestore:mongo:uri'))
        .fail(function () {
            var interval = nconf.get('modulestore:retryInterval');

            console.error(util.format('edx-modulestore-api: could not connect to the database, retrying in %dms', interval));
            setTimeout(connect, interval);
        });
};

modulestore.on('connected', function () {
    console.error('edx-modulestore-api: connection established');

    app.listen(nconf.get('port'), nconf.get('host'), function () {
        console.error(util.format('edx-modulestore-api: listening on %s:%s', nconf.get('host'), nconf.get('port')));
    });
});

modulestore.on('disconnected', function () {
    console.error('edx-modulestore-api: connection lost, exiting');
    process.exit(1);
});

connect();

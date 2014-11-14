'use strict';

var express = require('express');
var nconf = require('nconf');
var modulestore = require('edx-modulestore');

var wrappers = require('../wrappers');

// ## //

var resource = express.Router();

resource.get('/:location', function (req, res) {
    modulestore
        .getLocation(req.params.location, { lmsUrl: nconf.get('modulestore:lmsUrl') })
        .then(function (module) {
            if (module) {
                res.send(wrappers.auto(module));
            }
            else {
                res.status(404).send({
                    error: 'resource not found'
                });
            }
        })
        .fail(function () {
            res.status(500).end();
        });
});

// ## //

module.exports = resource;

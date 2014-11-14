'use strict';

var express = require('express');
var nconf = require('nconf');
var modulestore = require('edx-modulestore');

var wrappers = require('../wrappers');

// ## //

var resource = express.Router();

resource.get('/:id', function (req, res) {
    modulestore
        .getSequential(req.params.id, { lmsUrl: nconf.get('modulestore:lmsUrl') })
        .then(function (sequential) {
            if (sequential) {
                res.send(wrappers.sequential(sequential));
            }
            else {
                res.status(404).send({
                    error: 'resource not found'
                });
            }
        })
        .fail(function (err) {
            console.log(err);
            res.status(500).end();
        });
});

// ## //

module.exports = resource;

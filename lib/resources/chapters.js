'use strict';

var _ = require('lodash');
var express = require('express');
var nconf = require('nconf');
var modulestore = require('edx-modulestore');

var wrappers = require('../wrappers');

// ## //

var resource = express.Router();

resource.get('/:id', function (req, res) {
    modulestore
        .getChapter(req.params.id, nconf.get('modulestore:settings'))
        .then(function (chapter) {
            if (chapter) {
                res.send(wrappers.chapter(chapter));
            }
            else {
                res.status(404).send({
                    error: 'resource not found'
                });
            }
        })
        .catch(function () {
            res.status(500).end();
        });
});

resource.get('/:id/sequentials', function (req, res) {
    modulestore
        .getChapter(req.params.id, nconf.get('modulestore:settings'))
        .then(function (chapter) {
            if (!chapter) {
                res.status(404).send({
                    error: 'resource not found'
                });
            }
            else {
                return chapter.listChildren();
            }
        })
        .then(function (sequentials) {
            res.send(_.map(sequentials, wrappers.sequential));
        })
        .catch(function () {
            res.status(500).end();
        });
});

// ## //

module.exports = resource;

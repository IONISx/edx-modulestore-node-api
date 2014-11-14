'use strict';

var _ = require('lodash');
var express = require('express');
var nconf = require('nconf');
var modulestore = require('edx-modulestore');

var wrappers = require('../wrappers');

// ## //

var resource = express.Router();

resource.get('/', function (req, res) {
    modulestore
        .listCourses({}, { lmsUrl: nconf.get('modulestore:lmsUrl') })
        .then(function (courses) {
            res.send(_.map(courses, wrappers.course));
        })
        .fail(function () {
            res.status(500).end();
        });
});

resource.get('/:id', function (req, res) {
    modulestore
        .getCourse(req.params.id, { lmsUrl: nconf.get('modulestore:lmsUrl') })
        .then(function (course) {
            if (course) {
                res.send(wrappers.course(course));
            }
            else {
                res.status(404).send({
                    error: 'resource not found'
                });
            }
        })
        .fail(function () {
            res.status(400).send({
                id: req.params.id,
                error: 'invalid course id'
            });
        });
});

resource.get('/:id/chapters', function (req, res) {
    modulestore
        .getCourse(req.params.id, { lmsUrl: nconf.get('modulestore:lmsUrl') })
        .then(function (course) {
            if (!course) {
                res.status(404).send({
                    error: 'resource not found'
                });
            }
            else {
                return course.listChildren();
            }
        })
        .then(function (chapters) {
            res.send(_.map(chapters, wrappers.chapter));
        })
        .fail(function () {
            res.status(500).end();
        });
});

// ## //

module.exports = resource;

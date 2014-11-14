'use strict';

var _ = require('lodash');
var express = require('express');
var nconf = require('nconf');
var modulestore = require('edx-modulestore');

var Course = require('edx-modulestore/lib/course');

var wrappers = require('../wrappers');

// ## //

var resource = express.Router();

var _updateCourse = function (course, hash) {
    hash = _.pick(hash, function (v, k) {
        return k in course.attributes
            && course.attributes[k].set
            && k !== 'id';
    });

    _.assign(course, hash);
};

resource.get('/', function (req, res) {
    modulestore
        .listCourses({}, nconf.get('modulestore:settings'))
        .then(function (courses) {
            res.send(_.map(courses, wrappers.course));
        })
        .fail(function () {
            res.status(500).end();
        });
});

resource.post('/', function (req, res) {
    req.checkBody('id', 'id is required').notEmpty();
    req.checkBody('id', 'id is invalid').matches(/[a-z0-9-_]+\/[a-z0-9-_]+\/[a-z0-9-_]+/i);
    req.checkBody('name', 'name is required').notEmpty();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(400).send({
            error: 'validation error',
            fields: errors
        });
    }
    else {
        var course = new Course(req.body.id, nconf.get('modulestore:settings'));
        _updateCourse(course, req.body);

        course
            .save()
            .then(function () {
                res.redirect('/courses/' + encodeURIComponent(course.id));
            })
            .fail(function (err) {
                res.status(400).send({
                    error: 'a course with this id already exists'
                });
            });
    }
});

resource.get('/:id', function (req, res) {
    modulestore
        .getCourse(req.params.id, nconf.get('modulestore:settings'))
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
        .getCourse(req.params.id, nconf.get('modulestore:settings'))
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

'use strict';

var nconf = require('nconf');
var util = require('util');
var _ = require('lodash');

var Location = require('edx-modulestore/lib/location');

// ## //

var course = function (course) {
    var href = util.format('%s/v1/courses/%s', nconf.get('url'), encodeURIComponent(course.id));

    return _.merge(course.toJSON(), {
        _href: href,
        _chapters: href + '/chapters'
    });
};

var chapter = function (chapter) {
    var href = util.format('%s/v1/chapters/%s', nconf.get('url'), encodeURIComponent(chapter.id));

    return _.merge(chapter.toJSON(), {
        _href: href,
        _sequentials: href + '/sequentials'
    });
};

var sequential = function (sequential) {
    var href = util.format('%s/v1/sequentials/%s', nconf.get('url'), encodeURIComponent(sequential.id));

    return _.merge(sequential.toJSON(), {
        _href: href
    });
};

var auto = function (module) {
    var loc = Location.parse(module.location);

    if (loc) {
        if (loc.category === 'course') {
            return course(module);
        }
        if (loc.category === 'chapter') {
            return chapter(module);
        }
        if (loc.category === 'sequential') {
            return sequential(module);
        }
    }
};

// ## //

exports.auto = auto;
exports.course = course;
exports.chapter = chapter;
exports.sequential = sequential;

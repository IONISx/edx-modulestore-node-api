'use strict';

var nconf = require('nconf');
var express = require('express');
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
var morgan = require('morgan');

// ## //

var app = express();
var env = nconf.get('environment');

app.set('port', nconf.get('port'));
app.set('host', nconf.get('host'));
app.set('trust proxy', true);

if (env === 'production') {
    app.use(morgan('combined'));
}
else {
    app.use(morgan('dev'));
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

app.use('/v1', require('./v1'));

app.use(function (req, res) {
    res.status(404);

    if (req.accepts('html')) {
        res.render('404');
    }
    else if (req.accepts('json')) {
        res.send({ error: 'not found' });
    }
    else {
        res.type('txt').send('not found');
    }
});

// ## //

module.exports = app;

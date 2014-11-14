var express = require('express');

// ## //

var router = express.Router();

router
    .use('/modules', require('./resources/modules'))
    .use('/courses', require('./resources/courses'))
    .use('/chapters', require('./resources/chapters'))
    .use('/sequentials', require('./resources/sequentials'));

// ## //

module.exports = router;

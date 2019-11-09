var express = require('express');
var router = express.Router();

/**
 * The main goal of this router is to get in
 * real time the status of the different measurements
 * in the beer process.
 */

// GET /
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// GET Temperatures
router.get('/temperature', function(req, res, next) {
    res.send('respond with a resource');
});

// GET Time of Running Process
router.get('/time', function(req, res, next) {
    res.send('respond with a resource');
});

// GET On or Off
router.get('/isiton', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
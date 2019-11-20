var express = require('express');
var router = express.Router();

var awsIot = require('aws-iot-device-sdk');


// You will need to update the file paths.
var device = awsIot.device({
    keyPath: '8e0a5c05ff-private.pem.key',
   certPath: '8e0a5c05ff-certificate.pem.crt',
     caPath: 'rootCA.pem',
   clientId: 'nodejs-thing-01',
       host: 'a1nb3ykqw07ghq-ats.iot.us-east-2.amazonaws.com'
 });
 
/**
 * This router must be called constantly fromthe fron-end to show in real time the data in static intervals of time.
 * 
 * You will need to subscribe to both topics so you can get all the data...
 */

device
  .on('connect', function() {
    //console.log('connect');
    device.subscribe('NodeMCU-Topic');
  });

device
  .on('message', function(topic, payload) {
    // Change this to dynamically save the data in a global var to be able to export it.
    console.log('message', topic, ':\n', JSON.parse(payload.toString()));
  });

/**
 * The main goal of this router is to get in
 * real time the status of the different measurements
 * in the beer process.
 */

// GET /
router.get('/', function(req, res, next) {
    // Send all JSON data
    res.send('respond with a resource');
});

// GET Temperatures
router.get('/temperature', function(req, res, next) {
    // Send only the temperatures per sensor in a new JSON
    res.send('respond with a resource');
});

// GET Time of Running Process
router.get('/time', function(req, res, next) {
    // Send a math operation that gives the running time from the datetime of the brewing process JSON.
    res.send('respond with a resource');
});

// GET On or Off
router.get('/isiton', function(req, res, next) {
    // This should serve to determine what kind of info you're showing on the dashboard, if it's on, you should start showing the data overall.
    res.send('respond with a resource');
});

module.exports = router;
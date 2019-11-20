var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts 
// to connect with a client identifier which is already in use, the existing 
// connection will be terminated.
//
var device = awsIot.device({
   keyPath: '8e0a5c05ff-private.pem.key',
  certPath: '8e0a5c05ff-certificate.pem.crt',
    caPath: 'rootCA.pem',
  clientId: 'nodejs-thing-01',
      host: 'a1nb3ykqw07ghq-ats.iot.us-east-2.amazonaws.com'
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('NodeMCU-Topic');
  });

device
  .on('message', function(topic, payload) {
    //console.log('message', topic, payload.toJSON());
    //console.log('message', topic, JSON.stringify(payload));
    console.log('message', topic, ':\n', JSON.parse(payload.toString()));
  });
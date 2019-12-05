// Express Router
var express = require('express');
var router = express.Router();

// AWS IoT
var awsIot = require('aws-iot-device-sdk');

// WebSocket Server
var expressWs = require('express-ws')(router);

/**
 * This router must be called constantly from the fron-end to show in real time the data in static intervals of time.
 * 
 * You will need to subscribe to both topics so you can get all the data...
 *
 * The main goal of this router is to get in
 * real time the status of the different measurements
 * in the beer process.
 * 
 * It is required to open a WebSocket from the server side here!
 * The fron-end must call the API here to obtain the real-time data from the process,
 * hence we need the WebSocket to be open.
 */


// PAYLOAD to sent the condensed info from both topics
let payload = {
	status: {
		batch: 'N/A',
		datetime: 'N/A',
		runningTime: 'N/A',
		overall: 'N/A'
	},
	data: {
		temp1: 'N/A',
		temp2: 'N/A',
		temp3: 'N/A',
		temp4: 'N/A'
	}
}

///*** AWS IOT */

// device instance
var device = awsIot.device({
	keyPath: 'aws/NodeJS-Thing-01/8e0a5c05ff-private.pem.key',
	certPath: 'aws/NodeJS-Thing-01/8e0a5c05ff-certificate.pem.crt',
	caPath: 'aws/NodeJS-Thing-01/rootCA.pem',
	clientId: 'nodejs-thing-01',
	host: 'a1nb3ykqw07ghq-ats.iot.us-east-2.amazonaws.com'
});

// device subscriptions
device.on('connect', function() {
  	console.log('connect to topics...');
  	device.subscribe('NodeMCU-Topic');
	device.subscribe('brewingstatus');
	device.subscribe('brewingdata');
});

// device message capture
device.on('message', function(topic, msg) {
	// Parse the received JSON
	let money = JSON.parse(msg.toString());
	console.log('New Message from ', topic, ':\n', money);

	// IF the JSON is from status, then you gotta update the batch id and datetime,
	// you also have to reset the info to default values once the on value is 0.
	if (money.JSON_Type == 0) {
		payload.status.batch = money.batch;
		payload.status.datetime = money.datetime;
		// Add the reset if on = 0.

	// ELSE IF the JSON is from data, you gotta update the temperatures depending on the sensor.
	} else if (money.JSON_Type == 1) {

		switch (money.sensor) {
			case 's1': 
				payload.data.temp1 = money.temp;
				break;
			case 's2': 
				payload.data.temp2 = money.temp;
				break;
			case 's3': 
				payload.data.temp3 = money.temp;
				break;
			case 's4': 
				payload.data.temp4 = money.temp;
				break;
			default: console.log('ERROR from server side: Data JSON has invalid sensor ID...');
		}

	// Something went wrong with the JSON
	} else {
		console.log('ERROR from server side: Received JSON is not properly fromatted...');
	}
	
});

///*** WEBSOCKET */
router.ws('/', (ws, req) => {
	
	console.log('WebSocket initialized from server side...')
	
	// WebSocket message capture
  	ws.on('message', msg => {
		console.log('WebSocket Message received form server side...');

		// Here you gotta update the runningTime with the payload datetime and the current time.
		if (payload.status.datetime != 'N/A') {
			let d = new Date(payload.status.datetime);
			hh = d.getHours();
			mm = d.getMinutes();
			ss = d.getSeconds();
			// Change this:
			// https://tecadmin.net/get-current-date-time-javascript/
			payload.status.runningTime = `${hh}:${mm}:${ss}`;
		}

		// Here we update the overall temperature with the measures from payload data.
		if (payload.data.temp1 != 'N/A' && payload.data.temp2 != 'N/A' && payload.data.temp3 != 'N/A' && payload.data.temp4 != 'N/A') {
			payload.status.overall = (payload.data.temp1 + payload.data.temp2 + payload.data.temp3 + payload.data.temp4) / 4;
		}

		// Send payload
		ws.send(JSON.stringify(payload));
		console.log('WebSocket Message sent form server side...')
	});
	
	// WebSocket close
  	ws.on('close', () => {
    	console.log('WebSocket was closed from the server side...');
  	});
});

// GET /
router.get('/', function(req, res, next) {
	// Send all JSON data
	//res.send('respond with a resource');
	console.log('Hello from index.js');
	res.render('index', { title: 'Brewing Pal' });
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

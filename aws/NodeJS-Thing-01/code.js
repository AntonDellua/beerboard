/*
var wifi = require("Wifi");
var awsIot = require('aws-iot-device-sdk');
var WIFI_SSID = "IoT";
var WIFI_OPTIONS = {
  password : "1t3s0IoT18"
};

var device = awsIot.device({
   keyPath: '8e0a5c05ff-private.pem.key',
  certPath: '8e0a5c05ff-certificate.pem.crt',
    caPath: 'rootCA.pem',
  clientId: 'nodejs-thing-01',
      host: 'a1nb3ykqw07ghq-ats.iot.us-east-2.amazonaws.com'
});

wifi.stopAP(); // disable Wi-Fi AP

wifi.connect(WIFI_SSID, WIFI_OPTIONS, function(err) {
  if (err) {
    console.log("ERROR: Connection failed, error: " + err);
  } else {
    console.log("INFO: Successfully connected");
    console.log(wifi.getStatus());
    console.log(wifi.getIP());

    // set hostname and make the NodeMCU available
    // through espruino.local (ping or for using the
    // Espruino IDE over Wi-Fi
    wifi.setHostname("espruino");

    // save the Wi-Fi settings and they'll be used
    // automatically at power-up.
    wifi.save();
  }
});

device
  .on('connect', function() {
    console.log('connect');
    //device.subscribe('topic_1');
    device.publish('Test_Mizael01', JSON.stringify(
      { 
        user: 'Anton',
        device_id: '02',
        timestamp: '00:00:00',
        temp: 45
      }));
  });

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });
  */

var mqtt = require("MQTT").create(server, options);

var server = "a1nb3ykqw07ghq-ats.iot.us-east-2.amazonaws.com";
var options = {
  client_id : "nodejs-thing-01",   // the client ID sent to MQTT - it's a good idea to define your own static one based on `getSerial()`
  keep_alive: 60,         // keep alive time in seconds
  port: 8883,             // port number
  clean_session: true,
  //username: "username",   // default is undefined
  //password: "password",   // default is undefined
  protocol_name: "MQTT",  // or MQIsdp, etc..
  protocol_level: 4,      // protocol level
  key : 'key.pem',
  cert : 'cert.pem',
  ca : 'cacert.pem'
};

mqtt.on('connected', function() {
  mqtt.subscribe("test");
});

mqtt.on('publish', function(pub) {
  console.log("topic: " + pub.topic);
  console.log("message: " + pub.message);
});

var wlan = require("CC3000").connect();
wlan.connect( "Gutenberg", "Duraznote", function (s) {
  if (s=="dhcp") {
    console.log("My IP is "+wlan.getIP().ip);
    mqtt.connect();
  }
});

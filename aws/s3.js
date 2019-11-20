var AWS = require('aws-sdk');
var fs = require('fs');

var s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-east-2'});
var Bucket = "antondellua-s3-iot-beerboard";
var Key = "csv-files/batch01";

var file = fs.createWriteStream('./output.csv');

var params = {
    Bucket, 
    Key
};

var input = s3.getObject(params, function(err, data) {
    if (err) console.log('ERROR: ', err);
    else {
        console.log('SUCCESS!');
    }
}).createReadStream().pipe(file);
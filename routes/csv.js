var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');
var fs = require('fs');

// Change this to be dynamic
var s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-east-2'});
var Bucket = "antondellua-s3-iot-beerboard";
var Key = "csv-files/batch01";

// Change to show on dashboard instead of saving
var file = fs.createWriteStream('./output.csv');

/**
 * The only goal here is to GET the CSV files from AWS
 */

router.get('/', function(req, res, next) {

    // GET the most recent batch
    
    var params = {
        Bucket, 
        Key
    };

    s3.getObject(params, function(err, data) {
        if (err) console.log('ERROR: ', err);
        else {
            console.log('SUCCESS!');
            //res.send(data);
        }
    }).createReadStream().pipe(file);
    
    console.log('End of GET /');
});

router.get('/:batch', function(req, res, next) {

    // GET the specified batch

});

module.exports = router;
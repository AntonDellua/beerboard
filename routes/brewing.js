var express = require('express');
var router = express.Router();

// AWS
var AWS = require("aws-sdk");

/**
 * Here we manage the results of the beer process
 * We can get previous results or post new ones
 * 
 * CRUD
 * 
 * The user must use the post method to publish the qualitative
 * results from certain batches before being able to get them.
 * 
 * There must be validation to stop the user from the previous point.
 * 
 * Use with DYNAMODB data...
 * 
 * There are going to be 3 tables:
 * 1.- Brewing Status
 * 2.- Brewing Data
 * 3.- Brewing Results
 * 
 * All three must be parsed and joined before showing to the final user by batch,
 * so it is likely to have intermediate JSON formats that CAT all fields...
 * 
 * BATCHES
- Obtener valores tabla data, todos y por batch
- Dar retro a sistema de resultados cualitativos
- Obtener tabla por batch con datos de proceso y cualitativos si los tiene (Hacer procesamiento para juntar info de tres tablas)
  - Fecha y hora
  - ID
  - Temp minima
  - Temp maxima
  - Duracion
  - Datos cualitativos
 * 
 * 
 */

/// AWS Config ///
AWS.config.update({
    region: "us-east-2"
});

// AWS Vars
var docClient = new AWS.DynamoDB.DocumentClient();

var table = "NodeMCU-Test";     // Test value, must be changed
var key = "a04";          // Test value, must be changed

var beerStatusTable = "BrewingStatusDB";
var beerDataTable = "BrewingDataDB";
var beerResultsTable = "BrewingResultsDB";

/// ROUTES ///

// GET All Batch ID's
router.get('/', function(req, res, next) {
    // You need to retrieve all the batch id's from the beginning so
    // the user can select them in the menus...
    
    // Get everything from data table
    const params = {
        TableName: beerDataTable,
    };
    console.log("Scanning Beer Status table to get batch id's...");
    let data = docClient.scan(params, onScan);

    // Filter data
    id = getBatchIds(data);

    res.send(id);

});

// GET All Data results
router.get('/data', function(req, res, next) {

    //This should only be used to show the all the results from all the batches in the front-end

    // Get everything from data table
    const params = {
        TableName: beerDataTable,
    };
    console.log("Scanning Beer Data table.");
    let data = docClient.scan(params, onScan);

    res.send(data);
});

// GET One Batch by ID
router.get('/all/:batch', function(req, res, next) {
    // You need to get the info from the batch in params in all three tables
    // and then send it in a custom JSON structure or array...
    /**
     * You need to make this JSON and send it:
     * {
     *   batch: id,
     *   datetime begin: datetime,
     *   datetime end: datetime,
     *   avg temp: temp,
     *   highest temp: temp,
     *   lower temp: temp,
     *   beer type: string,
     *   taste: good,
     *   texture: string
     * }
     */
    let batch = req.params.batch;

    res.send('respond with a resource');
});

// GET One Batch Data by ID
router.get('/data/:batch', function(req,res, next) {
    // Get all the data from the DataTable for one batch.
    let batch = req.params.batch;

    res.send('Something');
});

// POST Qualy results from one Batch
router.post('/results/:batch', function(req, res, next) {
    // Validate that the referenced batch does not have qualy already
    // If not, allow him to give the feedback to the cloud with a form or something
    // The third table is going to be modified...
    /**
     * The third table JSON:
     * {
     *   beer type
     *   taste
     *   texture
     * }
     */
    let batch = req.params.batch;

    res.send('respond with a resource');
});

// PUT Change the Qualy from a Batch
router.put('/results/:batch', function(req, res, next) {
    let batch = req.params.batch;

    res.send('respond with a resource');
});

// DELETE a batch
router.delete('/all/:batch', function(req, res, next) {
    // Delete everything from a batch in all three tables
    let batch = req.params.batch;

    res.send('respond with a resource');
});

/// AWS FUNCTIONS ///

// This function serves to get everything from one table.
function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
        //console.log(data.Items[0].data.Batch);
        return data;
    }
}

function getBatchIds(data) {
    // Function to filter the JSON struct sent from DynamoDB.
    // First, get only the id's
    // Second, delete duplicates
    // Third, return result...
}

// Module Export
module.exports = router;
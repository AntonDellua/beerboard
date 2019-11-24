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

// GET All results
router.get('/', function(req, res, next) {

    // This might not be the best place to get all results since is the root route
    // Might just render here something and move the functionality elsewhere on 
    // another route...
    
    // Get everything from data table
    const params = {
        TableName: beerDataTable,
    };
    /*
    let scanResults = [];
    let items;

    do {
        items =  await documentClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");
    
    res.send(scanResults);*/
});

// GET One Batch by ID
router.get('/:batch', function(req, res, next) {
    // You need to get the info from the batch in params in all three tables
    // and then send it in a custom JSON structure or array...
    let batch = req.params.batch;

    res.send('respond with a resource');
});

// POST Qualy results from one Batch
router.post('/:batch', function(req, res, next) {
    // Validate that the referenced batch does not have qualy already
    // If not, allow him to give the feedback to the cloud with a form or something
    // The third table is going to be modified...
    let batch = req.params.batch;

    res.send('respond with a resource');
});

// PUT Change the Qualy from a Batch
router.put('/:batch', function(req, res, next) {
    let batch = req.params.batch;

    res.send('respond with a resource');
});

// DELETE a batch
router.delete('/:batch', function(req, res, next) {
    // Delete everything from a batch in all three tables
    let batch = req.params.batch;

    res.send('respond with a resource');
});

module.exports = router;
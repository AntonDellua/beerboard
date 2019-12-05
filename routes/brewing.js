var express = require('express');
var AWS = require("aws-sdk");       // AWS
var bodyParser = require('body-parser');

// Router instance
var router = express.Router();

// Body Parser Middleware
router.use(bodyParser.json());

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
        TableName: beerStatusTable,
    };
    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log("Scanning Beer Status table to get batch id's...");
    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
    
            // continue scanning if we have more items, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
            
            // Function to filter the JSON struct sent from DynamoDB.
            let IDS = [];
            // First, get only the id's
            data.Items.forEach(function(item) {
                IDS.push(item.data.batch);
            });
            // Second, delete duplicates
            IDS = new Set(IDS);
            IDS = [...IDS];
            console.log('IDS: ', IDS);
            // Third, return result...
            res.send(IDS);            
        }
    });

});

// GET All Data results
router.get('/data', function(req, res, next) {

    //This should only be used to show all the results from all the batches in the front-end

    // Get everything from data table
    const params = {
        TableName: beerDataTable,
    };

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log("Scanning Beer Data table to get all results.");
    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
    
            // continue scanning if we have more items, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }

            if (data != undefined) {
                let response = {};
                data.Items.forEach(function(item) {
                    console.log(item.data);
                    response.push(item.data);
                });
                res.send(response);
            }
                       
        }
    });

    //res.send(data);
});

// GET One Batch by ID
router.get('/all/:batch', function(req, res, next) {
    // You need to get the info from the batch in params in all three tables
    // and then send it in a custom JSON structure or array...
    let batch = req.params.batch;
    console.log('THE BATCH IS: ', batch);

    var params = {
        TableName: beerStatusTable,
        KeyConditionExpression: "#bt = :btc",
        ExpressionAttributeNames:{
            "#bt": "batch"
        },
        ExpressionAttributeValues: {
            ":btc": batch
        }/*
        Key:{
            // Change this to batch for final implementation!!!
            "batch": batch
        }*/
    };
    var docClient = new AWS.DynamoDB.DocumentClient();

    let payload = {
        batch,
        date: 'N/A',
        started: 'N/A',
        finished: 'N/A',
        total: 'N/A',
        avg: 'N/A',
        high: 'N/A',
        low: 'N/A',
        type: 'N/A',
        flavour: 'N/A',
        texture: 'N/A',
        grade: 'N/A'
    }

    // Scan Brewing Status Table
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            // continue scanning if we have more items, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }

            // Brewing Status processing to payload:
            if (data != undefined) {
                // Here you define:
                // - Date from datetime
                // - Started At from time of datetime
                // - Finished At
                // - Total Time
                let start = new Date();
                let end = new Date();
                let total = new Date();
                data.Items.forEach(function(item) {
                    console.log(item.data);
                    if (item.data.on == 1) {
                        start = new Date(item.data.datetime);
                    } else if (item.data.on == 0) {
                        end = new Date(item.data.datetime);
                    } else console.log('ERROR from /brewing/data/:batch... Brewing Status If...');
                });
                // TO DO: Revisar fechas...
                //total = Math.floor(end - start);
                payload.date = `${start.getDay()}/${start.getMonth()}/${start.getFullYear()}`;
                payload.started = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`;
                payload.finished = `${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`;
                //payload.total = `${total.getHours()}:${total.getMinutes()}:${total.getSeconds()}`;
            }
        }

        // Scan Brewing Data Table
        params.TableName = beerDataTable;
        docClient.query(params, function(err, data) {
            if (err) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                // continue scanning if we have more items, because
                // scan can retrieve a maximum of 1MB of data
                if (typeof data.LastEvaluatedKey != "undefined") {
                    console.log("Scanning for more...");
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    docClient.scan(params, onScan);
                }

                // Brewing Data processing to payload:
                if (data != undefined) {
                    // Here you define:
                    // - Average Temp
                    // - Highest Temp
                    // - Lowest Temp
                    let temps = [];
                    data.Items.forEach(function(item) {
                        console.log(item.data);
                        temps.push(item.data.temp);
                    });
                    const avg = (temps.reduce((a,b) => a + b, 0) / temps.length).toFixed(3);
                    const min = Math.min(...temps);
                    const max = Math.max(...temps);

                    payload.avg = avg;
                    payload.high = max;
                    payload.low = min;
                }
            }

            // Scan Brewing Results Table
            params.TableName = beerResultsTable;
            docClient.query(params, function(err, data) {
                if (err) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Scan succeeded.");
                    // continue scanning if we have more items, because
                    // scan can retrieve a maximum of 1MB of data
                    if (typeof data.LastEvaluatedKey != "undefined") {
                        console.log("Scanning for more...");
                        params.ExclusiveStartKey = data.LastEvaluatedKey;
                        docClient.scan(params, onScan);
                    }

                    // Brewing Results processing to payload:
                    if (data != undefined) {
                        // Here you define:
                        // - Beer Type
                        // - Flavour
                        // - Texture
                        // - Grade
                        data.Items.forEach(function(item) {
                            console.log(item.data);
                            payload.type = item.data.type;
                            payload.flavour = item.data.flavour;
                            payload.texture = item.data.texture;
                            payload.grade = item.data.grade;
                        });
                    }
                }

                console.log(payload);
                res.send(payload);
            });

        });

    });
    
});

// GET One Batch Data by ID
router.get('/data/:batch', function(req,res, next) {
    // Get all the data from the DataTable for one batch.
    let batch = req.params.batch;

    // Get everything from data table
    const params = {
        TableName: beerDataTable,
        Key:{
            // Change this to batch for final implementation!!!
            "batch": batch
        }
    };

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log("Scanning Beer Data table to get all results.");
    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
    
            // continue scanning if we have more items, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }

            if (data != undefined) {
                let response = {};
                data.Items.forEach(function(item) {
                    console.log(item.data);
                    response.push(item.data);
                });
                res.send(response);
            }
                       
        }
    });


    //res.send('Something');
});

// POST Qualy results from one Batch
router.post('/results/:batch', function(req, res, next) {
    // Validate that the referenced batch does not have qualy already
    // If not, allow him to give the feedback to the cloud with a form or something
    // The third table is going to be modified...
    
    let batch = req.params.batch;
    let json = req.body;

    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: beerResultsTable,
        Item:{
            "batch": batch,
            "data": {
                "type": json.type,
                "flavour": json.flavour,
                "texture": json.texture,
                "grade": json.grade
            }
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.send(data.Item);
        }
    });

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

// Module Export
module.exports = router;
var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

// Tables
var table = "NodeMCU-Test";
var beerStatusTable = "BrewingStatusDB";
var beerDataTable = "BrewingDataDB";
var beerResultsTable = "BrewingResultsDB";

/// Functions ///

// Test 1: Get an entry by key on DynamoDB
function test1() {
    var key = "a04";
    var params = {
        TableName: table,
        Key:{
            "Batch": key
        }
    };
    
    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}

function getEverythingFromTable() {
    var params = {
        TableName: table
    };
    
    console.log("Scanning Beer Data table.");
    docClient.scan(params, onScan);
}

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(item) {
           console.log(item);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
        //console.log(data.Items[0]);
    }
}

// Function Calls
test1();
//getEverythingFromTable();
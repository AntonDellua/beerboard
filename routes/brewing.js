var express = require('express');
var router = express.Router();

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
 */

// GET All results
router.get('/', function(req, res, next) {
    // Get everything from all tables
    res.send('respond with a resource');
});

// GET One Batch by ID
router.get('/:batch', function(req, res, next) {
    res.send('respond with a resource');
});

// POST Qualy results from one Batch
router.post('/:batch', function(req, res, next) {
    // Validate that the referenced batch does not have qualy already
    // If not, allow him to give the feedback to the cloud with a form or something
    res.send('respond with a resource');
});

// PUT Change the Qualy from a Batch
router.put('/:batch', function(req, res, next) {
    res.send('respond with a resource');
});

// DELETE a batch
router.delete('/:batch', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
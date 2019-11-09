var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.delete('/:userId', function(req, res) {
  res.send('Delete user '+req.params.userId);
});

router.put('/:userId', function(req, res) {
  res.send('Update user '+req.params.userId);
});

router.post('', function(req, res) {
  res.send('Create new user');
});


module.exports = router;

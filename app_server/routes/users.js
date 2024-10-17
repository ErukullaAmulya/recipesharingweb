var express = require('express');
var router = express.Router();

// GET users listing
router.get('/', function(req, res, next) {
  res.send('List of users');
});

// POST new user
router.post('/', function(req, res, next) {
  // Logic to create a new user
  res.send('User created');
});

// GET user by ID
router.get('/:id', function(req, res, next) {
  const userId = req.params.id;
  res.send(`Details of user with ID: ${userId}`);
});

module.exports = router;

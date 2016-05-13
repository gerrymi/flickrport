var express = require('express');
var async = require('async');
var router = express.Router();

/* GET Ports. */
router.get('/', function(req, res, next) {
  res.render('a', {
    title: "flickrPort",
  })
});

module.exports = router;
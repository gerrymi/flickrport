var express = require('express');
var router = express.Router();
var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "9925e9fc9654b7141240423e98da68e6",
      secret: "c6cd6aa6931ebfdd"
    };

/* GET Ports. */
router.get('/', function(req, res, next) {
  var user_id = req.param('user_id');  
  var username = req.param('username');  
  var gallery = []

  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    flickr.photosets.getList({
      user_id: user_id,
      format: JSON
    }, function(err, result) {
      for (var j in result.photosets.photoset) {
        flickr.photosets.getPhotos({
          user_id: user_id,
          photoset_id: result.photosets.photoset[j].id,
          format: JSON
        }, function(err, result2) {
          console.log (result.photosets.photoset[j].id+" "+result2.photoset.photo[0].id)
        });
      }
    });
  });


  res.render('p', {title: username})
});

module.exports = router;


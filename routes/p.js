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
      for (var i in result.photosets.photoset) {
        flickr.photosets.getPhotos({
          user_id: user_id,
          photoset_id: result.photosets.photoset[i].id,
          format: JSON
        }, function(err, result2) {
          // for (var j in result2.photoset.photo) {
          for (j=0; j<2; j++) {
            var farm = result2.photoset.photo[j].farm
            var server = result2.photoset.photo[j].server
            var id = result2.photoset.photo[j].id
            var secret = result2.photoset.photo[j].secret
            var photo = '{"id": '+id+', "secret": '+secret+', "server": '+server+', "farm": '+farm+', "photoset_id": '+result2.photoset.id+', "photoset_title": '+result2.photoset.title+' }'
            gallery.push (photo)
            // gallery += '<img class="hidden '+result2.photoset.id+'" src="https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '_' + 'm' + '.jpg" alt="">' 
            console.log (gallery)
          }
        });
      }
    });
  });
  
  res.render('p', {
    title: username,
    gallery: gallery + "a", 
  })

});

module.exports = router;


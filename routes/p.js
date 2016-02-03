var express = require('express');
var router = express.Router();
var Hogan = require('hjs')
var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "9925e9fc9654b7141240423e98da68e6",
      secret: "c6cd6aa6931ebfdd"
    };

/* GET Ports. */
router.get('/', function(req, res, next) {
  var user_id = req.param('user_id');  
  var username = req.param('username');  
  var thePhotoSets = "blank";
  var gallery = ""
  var fullGallery = ""
  
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
        flickr.photosets.getList({
          user_id: user_id,
          format: JSON
        }, function(err, result) {
          thePhotoSets = result.photosets.photoset;
          for (i = 0; i < 1; i++) {
          	flickr.photosets.getPhotos({
          		user_id: user_id,
          		photoset_id: result.photosets.photoset[i].id,
          		format: JSON
          	}, function(err, result2) {
          		photos = result2.photoset.photo
          		for (var j in photos) {
          			var farm = result2.photoset.photo[j].farm
          			var server = result2.photoset.photo[j].server
          			var id = result2.photoset.photo[j].id
          			var secret = result2.photoset.photo[j].secret
          			gallery += '<img src="https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '_' + 'm' + '.jpg" alt="">'
          		}
          		// console.log (result.photosets.photoset[i].id)
          		// console.log (result2.photoset)
          		fullGallery = gallery
          		console.log (fullGallery)
          		res.render('p', { 
          			title: 'Ports',
          			username: username,
          			user_id: user_id,
          			gallery: fullGallery
          		});
          	});
          };
  	   	});
  	});
});

module.exports = router;


// router.get('/', function(req, res, next) {
//   var user_id = req.param('user_id');  
//   var username = req.param('username');  
//   var photosets = "blank";
    
//     Flickr.tokenOnly(flickrOptions, function(error, flickr) {
//         flickr.photosets.getList({
//           user_id: user_id,
//           format: JSON
//         }, function(err, result) {
//           photosets = result.photosets;
//           var template = Hogan.compile("{{#photoset}} {{id}} {{/photoset}}");
//           var output = template.render(photosets);
//           console.log('output= ' + output);
//           res.render('p', { 
//           	title: 'Ports',
//           	username: username,
//           	user_id: user_id,
//           	photosets: output
//           });
//   	   	});
//   	});
// });


var express = require('express');
var async = require('async');
var router = express.Router();
var jsonfile = require('jsonfile')

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "9925e9fc9654b7141240423e98da68e6",
      secret: "c6cd6aa6931ebfdd"
    };

/* Sorting Function*/
var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}
/* GET Ports. */
router.get('/', function(req, res, next) {
  var username = req.param('username');  
  var user_id = ""  
  var gallery = []

  async.waterfall ([
    function (callback) {
      Flickr.tokenOnly(flickrOptions, function(error, flickr) {
        flickr.people.findByUsername({
          username: username,
          format: JSON
        }, function(err, result) {
          console.log (username+"'s user_id is "+result.user.id);
          user_id = result.user.id;
          callback (null, user_id)
        });
      });
    },
    function (user_id, callback) {
      Flickr.tokenOnly(flickrOptions, function(error, flickr) {
        flickr.photosets.getList({
          user_id: user_id,
          format: JSON
        }, function(err, result) {
          console.log ("Recieved Photoset List")
          // console.log (result.photosets.photoset)
          var photosetList = result.photosets.photoset
          callback (null, photosetList, user_id)
        });
      });
    },
    function (photosetList, user_id, callback) {
      var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
      var configs = {};

      async.forEachOf(photosetList, function (value, key, callback) {
          Flickr.tokenOnly(flickrOptions, function(error, flickr) {
            flickr.photosets.getPhotos({
              user_id: user_id,
              photoset_id: value.id,
              format: JSON
            }, function(err, result) {
              // console.log ("Recieved Photos from Photoset #"+ key)
              result.order = key;
              gallery.push (result)
              callback();
            });
          });
      }, function (err) {
          if (err) console.error(err.message);
          callback (null, gallery, user_id)
      })
    },
    function (gallery, user_id, callback) {
      gallery.sort(sort_by('order', false, parseInt));
      callback (null, gallery, user_id)
    },
    function (gallery, user_id, callback) {
      var file = './public/data/'+username+'.json'
      var obj = gallery
      jsonfile.writeFile(file, obj, {spaces: 2}, function (err) {
        console.error(err)
      })
      callback (null, gallery, user_id)
    }
    ], function(err, results) {
    res.render('p', {
      title: username+"'s FlickrPort",
      username: username,
      user_id: user_id 
    })
  })  



});

module.exports = router;

// gallery += '<img class="hidden '+result2.photoset.id+'" src="https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '_' + 'm' + '.jpg" alt="">' 
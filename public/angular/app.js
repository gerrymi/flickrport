var app = angular.module("flickrPort", ["infinite-scroll", "ngAnimate", "ngRoute"]);
app.config(function($routeProvider){
    $routeProvider.
        when('/', {templateUrl: '/angular/views/home.html', controller: 'galleryCtrl'}).
        when('/:username', {templateUrl: '/angular/views/user.html', controller: 'galleryCtrl'}).
        when('/:username/:photoset_id', {templateUrl: '/angular/views/photoset.html', controller: 'galleryCtrl'}).
        otherwise({ redirectTo: '/' });
});
app.controller('galleryCtrl', function($scope, $routeParams, $location, $anchorScroll, flickrPort) {
	$scope.flickrPort = new flickrPort();
	$scope.scrollTo = function(x) {
      var newHash = 'photoset-' + x;
            if ($location.hash() !== newHash) {
              // set the $location.hash to `newHash` and
              // $anchorScroll will automatically scroll to it
              $location.hash('photoset-' + x);
            } else {
              // call $anchorScroll() explicitly,
              // since $location.hash hasn't changed
              $anchorScroll();
            }
      console.log(newHash)
   }
   $scope.username = $routeParams.username;
   $scope.photoset = $routeParams.photoset_id;2
})

app.factory('flickrPort', function($http, $routeParams) {
	var flickrPort = function() {
		this.photoSets = [];
		this.busy = false;
	};
	var loaded = 0

    flickrPort.prototype.nextPage = function() {
		if (this.busy) return;
		this.busy = true;
		$http.get("https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=9925e9fc9654b7141240423e98da68e6&username="+$routeParams.username+"&format=json&nojsoncallback=1").then(function(res){
			user_id = res.data.user.id;
	      	$http.get("https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=9925e9fc9654b7141240423e98da68e6&user_id="+user_id+"&format=json&nojsoncallback=1").then(function(res){
		        photoSetList = res.data.photosets.photoset
		        for (var i = loaded; i < loaded+3; i++) {
		          	$http.get("https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=9925e9fc9654b7141240423e98da68e6&photoset_id="+photoSetList[i].id+"&user_id="+user_id+"&format=json&nojsoncallback=1").then(function(res){
			            photos = res.data.photoset 
			            this.photoSets.push(photos);
		          	}.bind(this));
		        }
		        loaded += 3
			   	this.busy = false;
		    }.bind(this));
		}.bind(this));
	};
    return flickrPort;
});
// app.factory('flickrPort', function($http) {
// 	var flickrPort = function() {
// 	  this.photoSets = [];
// 	  this.busy = false;
// 	};
// 	var loaded = 0

//     flickrPort.prototype.nextPage = function() {
// 		if (this.busy) return;
// 		this.busy = true;

//       	$http.get("https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=9925e9fc9654b7141240423e98da68e6&user_id="+user_id+"&format=json&nojsoncallback=1").then(function(res){
// 	        photoSetList = res.data.photosets.photoset
// 	        for (var i = loaded; i < loaded+3; i++) {
// 	          	$http.get("https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=9925e9fc9654b7141240423e98da68e6&photoset_id="+photoSetList[i].id+"&user_id="+user_id+"&format=json&nojsoncallback=1").then(function(res){
// 		            photos = res.data.photoset 
// 		            this.photoSets.push(photos);
// 	          	}.bind(this));
// 	        }
// 	        loaded += 3
// 		   	this.busy = false;
// 	    }.bind(this));
// 	};
//     return flickrPort;
// });

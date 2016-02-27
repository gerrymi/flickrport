var app = angular.module("flickrPort", ["infinite-scroll", "ngAnimate", "ui.router", "angular-click-outside"]);
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('no-user', {
      url: "/",
      templateUrl: '/angular/views/no-user.html',
      controller: 'galleryCtrl'
    })
    .state('username', {
      url: "/:username",
      templateUrl: '/angular/views/user.html',
      controller: 'galleryCtrl'
    })
    .state('username.photoset_id', {
      url: "/:photoset_id",
      templateUrl: '/angular/views/photoset.html',
      controller: 'galleryCtrl'
    })
  $urlRouterProvider.otherwise("/");
});
app.controller('galleryCtrl', function($scope, $stateParams, $http, $location, $anchorScroll, flickrPort) {
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
   }
   $scope.username = $stateParams.username;
   $scope.photoset_id = $stateParams.photoset_id;
   $http.get("https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=9925e9fc9654b7141240423e98da68e6&username="+$stateParams.username+"&format=json&nojsoncallback=1").then(function(res){
			user_id = res.data.user.id;
			$http.get("https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=9925e9fc9654b7141240423e98da68e6&photoset_id="+$stateParams.photoset_id+"&user_id="+user_id+"&format=json&nojsoncallback=1").then(function(res){
			$scope.photos = res.data.photoset.photo
   		});
   });
   $scope.go = function() {
     $location.path( $stateParams.username );
   };
   $scope.scrollOff = function(){ 
   	if (scroll != "modal-no-scroll") {
   		$scope.scroll = "modal-no-scroll";
   	} else {
   		$scope.scroll = "modal-scroll"
   	};
   }

})

app.factory('flickrPort', function($http, $stateParams) {
	var flickrPort = function() {
		this.photoSets = [];
		this.busy = false;
	};
	var loaded = 0

    flickrPort.prototype.nextPage = function() {
		if (this.busy) return;
		this.busy = true;
		$http.get("https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=9925e9fc9654b7141240423e98da68e6&username="+$stateParams.username+"&format=json&nojsoncallback=1").then(function(res){
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
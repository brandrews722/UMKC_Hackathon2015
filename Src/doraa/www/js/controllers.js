var appController = angular.module('doraa.controllers', [])

appController.controller('loginCtrl', function($scope,$state) {
$scope.login = function()
{
    $state.go('main.dashboard.weather');
}
})

appController.controller('signUpController', function($scope,$state) {
 
})

appController.controller('weatherCtrl', function($scope,$state,$http) {
        var sourcePlace;
    var destinationPlace;
        var autocompleteForSource;
    var autoCompleteForDestination;
    $scope.init =function(){
    var mapOptions = {
        zoom: 6,
       mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
     var sourceInput = document.getElementById('txt_SourcePlace');
            autocompleteForSource = new google.maps.places.Autocomplete(sourceInput);
        google.maps.event.addListener(autocompleteForSource, 'place_changed', function () {
                 sourcePlace = autocompleteForSource.getPlace();
            });
    var destInput = document.getElementById('txt_DestinationPlace');
      autoCompleteForDestination = new google.maps.places.Autocomplete(destInput);
        google.maps.event.addListener(autoCompleteForDestination, 'place_changed', function () {
                 destinationPlace = autoCompleteForDestination.getPlace();
            });
    //This piece of code was referred from Google Maps API docs. https://developers.google.com/maps/articles/geolocation?hl=en
    if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      $scope.map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }   
      function handleNoGeolocation(errorFlag) {
        //Failure of the service.##
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    $scope.map.setCenter(initialLocation);
  }
    }
  })


appController.controller('historyCtrl', function($scope,$state) {

});

app.controller('tabsContrlr',function($scope,$state,$log)
               {
$scope.goToHome=function()
{
$state.go('main.dashboard.home');
}
});
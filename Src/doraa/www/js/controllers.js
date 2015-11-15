var appController = angular.module('doraa.controllers', [])

appController.controller('loginCtrl', function ($scope, $state) {
    $scope.login = function () {
        $state.go('main.dashboard.weather');
    }
})

appController.controller('signUpController', function ($scope, $state) {

})

appController.controller('weatherCtrl', function ($scope, $state, $http, $filter, weatherFactory, latLngFactory) {
    $scope.data = {};
    $scope.data.date = new Date(); //sets current date
    $scope.data.time = new Date(); //sets current time MM:DD:A
    
    
    var sourcePlace;
    var destinationPlace;
    var autocompleteForSource;
    var autoCompleteForDestination;
    $scope.init = function () {
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
        if (navigator.geolocation) {
            browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function (position) {
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                $scope.map.setCenter(initialLocation);
            }, function () {
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
        //initialize Date/Time with current Date/Time
        document.getElementById("txt_date").value = "11/10/2015";
        
    }



    //function to load directions and get weather events for the start and end points
    $scope.doEverything = function () {

        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            directionsService.route({
                origin: document.getElementById('txt_SourcePlace').value,
                destination: document.getElementById('txt_DestinationPlace').value,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {
                lat: 41.85,
                lng: -87.65
            }
        });
        directionsDisplay.setMap(map);
        calculateAndDisplayRoute(directionsService, directionsDisplay);
        weatherFactory.getWeatherStart();
        weatherFactory.getWeatherEnd();
        document.getElementById("weatherIncrements").innerHTML = "<img id='elNino' src='http://i.kinja-img.com/gawker-media/image/upload/s--tI4ZDhBj--/na2jhagaer4erqt9vqqj.gif'>";
    }
})


appController.factory('weatherFactory', function ($http, latLngFactory) {
    var weatherData = [];



    return {
        getWeatherStart: function () {
            var apiLink = "https://api.forecast.io/forecast/cb1b111846173e12ba6436ce2cef9817/";
            var lat1, lng1;
            latLngFactory.getStart().then(function (latLngData) {
                var records = latLngData.data.results;
                console.log("records", records);
                var locality = "";
                for (var i = 0; i < records[0].address_components.length; i++) {
                    if (records[0].address_components[i].types[0] == "locality") //1 object, retrieves all address components and searches for the locality type
                    {
                        locality = records[0].address_components[i].long_name;
                    }
                }
                console.log("locality", locality);

                for (var i = 0; i < records.length; i++) {
                    apiLink += records[i].geometry.location.lat;
                    lat1 = records[i].geometry.location.lat;
                    apiLink += ",";
                    apiLink += records[i].geometry.location.lng;
                    lng1 = records[i].geometry.location.lng;

                    return $http.get(apiLink).then(function (response) {
                        weatherData = response;
                        console.log("weatherData: ", weatherData);
                        //                        document.getElementById("weatherStart").innerHTML = "";
                        document.getElementById("weatherStart").innerHTML = "<iframe id='forecast_embed' type='text/html' frameborder='0' height='245' width='100%' src='http://forecast.io/embed/#lat=" + lat1 + "&lon=" + lng1 + "&name=" + locality + "&color=#00aaff&font=Georgia&units=us'> </iframe>";

                        return weatherData;
                    })
                }
            });
        },
        getWeatherEnd: function () {

            var apiLink = "https://api.forecast.io/forecast/cb1b111846173e12ba6436ce2cef9817/";
            var lat1, lng1;
            latLngFactory.getEnd().then(function (latLngData) {
                var records = latLngData.data.results;
                console.log("records", records);
                var locality = "";
                for (var i = 0; i < records[0].address_components.length; i++) {
                    if (records[0].address_components[i].types[0] == "locality") //1 object, retrieves all address components and searches for the locality type
                    {
                        locality = records[0].address_components[i].long_name;
                    }
                }
                console.log("locality", locality);

                for (var i = 0; i < records.length; i++) {
                    apiLink += records[i].geometry.location.lat;
                    lat1 = records[i].geometry.location.lat;
                    apiLink += ",";
                    apiLink += records[i].geometry.location.lng;
                    lng1 = records[i].geometry.location.lng;

                    return $http.get(apiLink).then(function (response) {
                        weatherData = response;
                        console.log("weatherData: ", weatherData);
                        //                        document.getElementById("weatherStart").innerHTML = "";
                        document.getElementById("weatherEnd").innerHTML = "<iframe id='forecast_embed' type='text/html' frameborder='0' height='245' width='100%' src='http://forecast.io/embed/#lat=" + lat1 + "&lon=" + lng1 + "&name=" + locality + "&color=#00aaff&font=Georgia&units=us'> </iframe>";
                        return weatherData;
                    })
                }
            })
        },
        getWeatherMiddle: function () {

        }
    }
})

appController.factory('latLngFactory', function ($http) {
    var latLngData = [];

    function parseForGeoCoding(data) {
        var parsedString = "https://maps.googleapis.com/maps/api/geocode/json?address=";

        for (var i = 0; i < data.length; i++) {
            if (data[i] != " ") {
                parsedString += data[i];
            } else if (data[i] == " ") {
                parsedString += "+";
            }
        }
        parsedString += "&key=AIzaSyA25DE6E-TuD0XcvND-FRYkmtgR8wZBAkc";
        return parsedString;
    }

    return {
        getStart: function () {
            var startData = document.getElementById("txt_SourcePlace").value;
            return $http.get(parseForGeoCoding(startData)).then(function (response) {
                latLngData = response;
                console.log("latlng object", latLngData);
                return latLngData;
            })
        },
        getEnd: function () {
            var endData = document.getElementById('txt_DestinationPlace').value;
            return $http.get(parseForGeoCoding(endData)).then(function (response) {
                latLngData = response;
                console.log(latLngData);
                return latLngData;
            })
        }
    }
})


appController.controller('historyCtrl', function ($scope, $state) {

})

app.controller('tabsContrlr', function ($scope, $state, $log) {
    $scope.goToHome = function () {
        $state.go('main.dashboard.home');
    }
})
appController.controller('timeController', function($scope) {
  $scope.model = {
    time : new Date(),
  };
})

appController.directive('formattedTime', function ($filter) {

  return {
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel) {
        if( !ngModel )
            return;
        if( attr.type !== 'time' )
            return;
                
        ngModel.$formatters.unshift(function(value) {
            return value.replace(/:[0-9]+.[0-9]+$/, '');
        });
    }
  };
});
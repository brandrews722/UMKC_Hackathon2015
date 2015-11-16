var appController = angular.module('doraa.controllers', ['ionic','doraa.userServices'])

//This is the controller for the login page functionality.
var userData;

appController.controller('loginCtrl', function($scope,$state,appUserServices,$window,$ionicLoading,$ionicPopup) {
    var loginFailedCount=0;
     $scope.userName=""
     $scope.password="";
 
    
$scope.getUserDetails =function()
{
    
   $scope.userName = document.getElementById('txt_UserName').value; 
     if($scope.userName!=null && $scope.userName!="" && loginFailedCount==0)
    {
         userData=null;
          $ionicLoading.show({
				  template: 'Please wait...'
				});
        appUserServices.login($scope.userName,onUserNameFound_Success);
    }
}
    $scope.login = function()
{   
  
     $scope.password = document.getElementById('txt_Password').value;
   if($scope.password!=null && userData!=null && userData.password!=null)
   {
          loginFailedCount++;
       if(loginFailedCount<3){
       if(userData.password != $scope.password)
       {
         
           document.getElementById('err_Password').innerHTML="You have " + (3-loginFailedCount) + " attempts left. "
           if(document.getElementById('err_Password').classList.contains('hide')){
           document.getElementById('err_Password').classList.remove('hide');
       }
          
       }
       else{
        loginFailedCount=0;
      
       $state.go('main.dashboard.weather');
       }
       }
       else
       {
           $ionicLoading.show({
				  template: 'Please wait...'
				});
           appUserServices.deactivateUser(userData,onUserDeactivated_Success);
     
       }
   }
        else
        {
            showAlert("Something went wrong","We apologize for the inconvenience. Please try again later.");
        }
 
    
}
      function showAlert(title,message) {
   var alertPopup = $ionicPopup.alert({
     title: title,
     template: message
   });
   alertPopup.then(function(res) {
     console.log('There was some problem');
   });
 }
    
$scope.goToRegistration =function()
{
    $state.go('register')
}
$scope.reloadLogin =function()
{
   $window.location.reload(true);
}
   function onUserNameFound_Success(data)
    {
       
        if(data!=null)
        {
        loginFailedCount=0;
            userData = data;
           
            if(userData.userName==$scope.userName)
            {
                document.getElementById('txt_UserName').disabled=true;
                if(document.getElementById('lbl_Password').classList.contains('passwordLabel')){
               document.getElementById('lbl_Password').classList.remove('passwordLabel');
                document.getElementById('btn_Login').classList.remove('passwordLabel');
                    document.getElementById('btn_ReLogin').classList.remove('passwordLabel');
                      document.getElementById('btn_ForgotPassword').classList.remove('passwordLabel');                   
                    
                }
                document.getElementById('err_UserName').classList.add('hide');
                loginFailedCount=0;
            }
            else
            {
                $ionicLoading.hide();     
                document.getElementById('err_UserName').innerHTML="You do not have an account or your acccount might not be active.";
                     document.getElementById('err_UserName').classes.remove('hide');
            }
                
        }
         $ionicLoading.hide();
    }
    $scope.forgotPassword =function()
    {
          $ionicLoading.show({
				  template: 'Please wait...'
				});
        appUserServices.emailUser(userData,onEmailSend_Success); 
    }
    function onUserDeactivated_Success(result)
    {
              document.getElementById('err_Password').innerHTML= "Your account has been deactivated";
        //To hide the forgot password button
        if(!document.getElementById('btn_ForgotPassword').classList.contains('passwordLabel'))
        {
            document.getElementById('btn_ForgotPassword').classList.add('passwordLabel');
        }
            if(document.getElementById('err_Password').classList.contains('hide')){
                 
           document.getElementById('err_Password').classList.remove('hide');
               
                
       }
        $ionicLoading.hide();
    }
})
//This is the controller for the registration page functionality.
appController.controller('signUpController', function($scope,$state,$http,appUserServices,$ionicLoading,$ionicPopup) {
    document.getElementById('txt_Name').value ="";
    document.getElementById('txt_userName').value ="";

 //Redirect to the login page after successfull registration.
    $scope.goToLoginPage =function()
 {
     $state.go('login');
 }
 //Submit the user registration data to the database.
 $scope.submitForm = function(isValid) {
$scope.userToBeAdded={};
		// check to make sure the form is completely valid
		if (isValid) { 
           $scope.userToBeAdded.name= document.getElementById('txt_Name').value;
            $scope.userToBeAdded.userName=document.getElementById('txt_userName').value;
            $scope.userToBeAdded.password =generatePassword($scope.userToBeAdded.name);
            $scope.userToBeAdded.uerLoginCount=0;
            $scope.userToBeAdded.status="Active";
          
            if($scope.userToBeAdded!=null)
            {
                $ionicLoading.show({
				  template: 'Please wait...'
				});
                appUserServices.registerUser($scope.userToBeAdded,onUserRegistration_Success);
            }
	        
		}

	};
    function onUserRegistration_Success(response,user)
    {
       if(response!=null)
       {
           appUserServices.emailUser(user,onEmailSend_Success);    
           
       }
    }
    function onEmailSend_Success(response)
    {
         $ionicLoading.hide();
        showAlert("Thank you " +  $scope.userToBeAdded.name, "You would receive your password to " +  $scope.userToBeAdded.userName );
         
                $state.go('login');  
    }
    function generatePassword(key)
    {
        var prefix = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   for( var i=0; i < 5; i++ ){
       prefix += possible.charAt(Math.floor(Math.random() * possible.length));
    }
        return (key+prefix);
    }
          function showAlert(title,message) {
   var alertPopup = $ionicPopup.alert({
     title: title,
     template: message
   });
   alertPopup.then(function(res) {
     console.log('There was some problem');
   });
 }

})

appController.controller('weatherCtrl', function ($scope, $state, $http, $filter, weatherFactory, latLngFactory,userTripInfoServices,$ionicLoading,$ionicPopup) {
    $scope.data = {};
    $scope.data.date = new Date(); //sets current date
    console.log("dater", $scope.data.date.toUTCString());


        var middleResponseArr = [];
        var middleResponseArrSumm = [];
        var middleResponseArrDate = [];


    var sourcePlace;
    var destinationPlace;
    var autocompleteForSource;
    var autoCompleteForDestination;
    //This method would load the map with the default goelocation if the browser supports it.
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
                showAlert("Geolocation service failed.","Your browser does not support it.");
                initialLocation = newyork;
            } else {
                showAlert("Your browser doesn't support geolocation", "We've placed you in Siberia.");
                initialLocation = siberia;
            }
            $scope.map.setCenter(initialLocation);
        }

        
    }
          
//This function would save the details about the trip that the user is creating.
$scope.saveTripInfo =function()
{
    if(userData!=undefined && userData!=null && userData.userName!=null && userData.userName!=""){
   $scope.tripInfo={};
   $scope.tripInfo.userName= userData.userName;
    $scope.tripInfo.source=document.getElementById('txt_SourcePlace').value;
    $scope.tripInfo.destination=document.getElementById('txt_DestinationPlace').value;
    $scope.tripInfo.startDate =document.getElementById('txt_date').value;
    $scope.tripInfo.startTime=document.getElementById('txt_time').value;
        if($scope.tripInfo!=null && $scope.tripInfo.userName!=null)
        {
              $ionicLoading.show({
				  template: 'Please wait...'
				});
            userTripInfoServices.saveUserTrip($scope.tripInfo,onTripInfoSaved_Success)
        }
    }
    else
    {
        showAlert("Session expired","Please try to login and try again");
    }
}
function showAlert(title,message) {
   var alertPopup = $ionicPopup.alert({
     title: title,
     template: message
   });
   alertPopup.then(function(res) {
     console.log('There was some problem');
   });
 }
function onTripInfoSaved_Success(result)
    {
        if(result!=null)
        {
            $scope.doEverything();
        }
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
                    console.log("logging", response.routes[0].legs[0].duration.value);
                    localStorage.setItem("duration", response.routes[0].legs[0].duration.value);
                    directionsDisplay.setDirections(response);
                } else {
                    showAlert("Directions request failed" ,"Regret the inconvenience caused. Please try again");
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
        console.log("123", localStorage.getItem('latStart'));
        //get weather middle
        var latStart = parseFloat(localStorage.getItem('latStart')),
            lngStart = parseFloat(localStorage.getItem('lngStart')),
            latEnd = parseFloat(localStorage.getItem('latEnd')),
            lngEnd = parseFloat(localStorage.getItem('lngEnd'));

        console.log(latStart);
        var latDistance = latEnd - latStart;
        var lngDistance = lngEnd - lngStart;
        console.log("lngEnd", lngEnd);
        console.log("lngStart", lngStart);
        var pts = localStorage.getItem('duration') / 3600;
        console.log("durdur", localStorage.getItem('duration'));
        console.log(pts);
        var weatherLatArr = [],
            weatherLngArr = []
        ;

        for (var i = 1; i < Math.floor(pts); i++) {
            weatherLatArr.push(((i * latDistance) / Math.floor(pts)) + latStart);
            weatherLngArr.push(((i * lngDistance) / Math.floor(pts)) + lngStart);
            weatherFactory.getWeatherMiddle((((i * latDistance) / Math.floor(pts)) + latStart), (((i * lngDistance) / Math.floor(pts)) + lngStart), i).then(function (response) {
                document.getElementById("weatherIncrements").innerHTML = "<div id='row' class='travelWeather'>Travel Weather</div>";

                consolidateArr(response.key, response.value.data.currently.temperature, response.value.data.currently.summary, response.date);
                console.log("--------------", response);
                console.log("%%%%%%%%%", middleResponseArr);
               
            });
        };
        console.log("***************", middleResponseArr);

        placeinUI();
        console.log(weatherLatArr);
        console.log(weatherLngArr);
  $ionicLoading.hide();
        //       // weatherFactory.getWeatherMiddle();
        //        document.getElementById("weatherIncrements").innerHTML = "<img id='elNino' src='http://i.kinja-img.com/gawker-media/image/upload/s--tI4ZDhBj--/na2jhagaer4erqt9vqqj.gif'>";



    }

    function consolidateArr(key, temp, summ, date) {

        middleResponseArr[key - 1] = temp;
        middleResponseArrSumm[key - 1] = summ;
        middleResponseArrDate[key - 1] = date;
         console.log("ggsfhsfhs" + middleResponseArr);
        console.log("ggsfhsfhs" + middleResponseArrSumm);
        console.log("ggsfhsfhs" + middleResponseArrDate);
        
        for(var i=0; i<middleResponseArr.length; i++){
            var time = parseInt(i)+1;
            document.getElementById("weatherIncrements").innerHTML += "<div class='row' id='weatherRows'><div class='col'>Hour " + time + "</div><div class='col'>" + middleResponseArr[i]+ "&deg;</div><div class='col'>" + middleResponseArrSumm[i] + "</div></div>";
        }
        
        
    }

    function placeinUI() {
        console.log("hi");
        console.log("ggsfhsfhs" + middleResponseArr);
        console.log("ggsfhsfhs" + middleResponseArrSumm);
        console.log("ggsfhsfhs" + middleResponseArrDate);
    }
 $scope.logOut=function()
    {
     userData=null;   
     $state.go('about');
    }
})


appController.factory('weatherFactory', function ($http, latLngFactory,$ionicLoading) {
    var weatherData = [];
    var dictResponse = [];
    var dictDate = [];


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
        getWeatherMiddle: function (latVal, lngVal, hour) {
            //https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE,TIME
            console.log("latVal", latVal);

            var apiLink = "https://api.forecast.io/forecast/cb1b111846173e12ba6436ce2cef9817/";
            apiLink += latVal;
            apiLink += ",";
            apiLink += lngVal;
            apiLink += ",";

            var curTime = document.getElementById("txt_time").value;
            var curDate = document.getElementById("txt_date").value;
            console.log("curTime", curTime);
            console.log("curDate", curDate);
            var splitTime = curTime.split(":");
            var splitDate = curDate.split("-");
            var weatherHour = 0;
            console.log(hour);
            weatherHour = parseInt(splitTime[0]) + parseInt(hour);
            var weatherDate = "";
            weatherDate = String(splitDate[0]) + "-" + String(splitDate[1]) + "-" + String(splitDate[2]) + "T" + String(weatherHour) + ":" + String(splitTime[1]) + ":00-0400";
            console.log(weatherDate);

            apiLink += weatherDate;

            return $http.get(apiLink).then(function (response) {
                //weatherData.push(response);
                dictResponse = {
                    "key": hour,
                    "value": response,
                    "date": weatherDate
                };
                //                document.getElementById("weatherIncrements").innerHTML += "<div class='row'><div class='col'>" + weatherDate + "</div><div class='col'>" + + weatherData.data.currently.apparentTemperature + "</div></div>";
                //*/
                return dictResponse;
            })


        }
    }


})

appController.factory('latLngFactory', function ($http,$ionicLoading) {
    var latLngData = [];

    //takes a string of a google places response and replaces white space with plus signs
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
                localStorage.setItem("latStart", latLngData.data.results[0].geometry.location.lat);
                localStorage.setItem("lngStart", latLngData.data.results[0].geometry.location.lng);
                console.log("latlng object", latLngData);
                return latLngData;
            })
        },
        getEnd: function () {
            var endData = document.getElementById('txt_DestinationPlace').value;
            return $http.get(parseForGeoCoding(endData)).then(function (response) {
                latLngData = response;
                localStorage.setItem("latEnd", latLngData.data.results[0].geometry.location.lat);
                localStorage.setItem("lngEnd", latLngData.data.results[0].geometry.location.lng);
                console.log(latLngData);
                return latLngData;
            })
        }
    }
})


appController.controller('historyCtrl', function ($scope, $state,userTripInfoServices,$ionicLoading) {
if(($scope.userTrips==undefined || $scope.userTrips==null) && userData!=undefined && userData!=null && userData.userName!=undefined && userData.userName!=null){
    $ionicLoading.show({
				  template: 'Please wait...'
				});
    userTripInfoServices.getUserTrips(userData.userName,onUserTrips_Success);
}
    $scope.logOut=function()
    {
        $state.go('about');
    }
    function onUserTrips_Success(data)
    {
        if(data!="No trips present")
        {
            $scope.userTrips=data;
        }
       $ionicLoading.hide();
    }
    
    
})

//creates a date object (time)
appController.controller('timeController', function ($scope) {
    $scope.model = {
        time: new Date(),
    };
})

//formats time
appController.directive('formattedTime', function ($filter) {

    return {
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {
            if (!ngModel)
                return;
            if (attr.type !== 'time')
                return;

            ngModel.$formatters.unshift(function (value) {
                return value.replace(/:[0-9]+.[0-9]+$/, '');
            });
        }
    };
});
//This controller handles the logic to redirect to the home page.
app.controller('tabsContrlr',function($scope,$state,$log)
               {
$scope.goToWeatherInfo=function()
{
$state.go('main.dashboard.weather');
    $window.location.reload(true);
}
$scope.goToHistory = function()
{
    $state.go('main.dashboard.history');
    $window.location.reload(true);
}

})
app.controller('aboutPageCntrlr', function($scope,$log,$state)
               {
    $scope.goToRegistration = function()
    {
        $state.go('register');
    };
    $scope.goToLoginPage = function()
    {
        $state.go('login')
    };
});

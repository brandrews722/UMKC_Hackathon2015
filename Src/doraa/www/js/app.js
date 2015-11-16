// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app=angular.module('doraa', ['ionic','doraa.controllers'])

//.run(function($ionicPlatform) {
//  $ionicPlatform.ready(function() {
//    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//    // for form inputs)
//    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//      cordova.plugins.Keyboard.disableScroll(true);
//
//    }
//    if (window.StatusBar) {
//      // org.apache.cordova.statusbar required
//      StatusBar.styleDefault();
//    }
//  });
//})

  
  app.config(function($httpProvider,$stateProvider,$urlRouterProvider) {
   // delete $httpProvider.defaults.headers.common["X-Requested-With"]


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
    
  $stateProvider
    
  .state('main',{
  url:'/doraa',
      abstract:true,
      template:'<ion-nav-view name="Dashboard"></ion-nav-view>'
  })
  
  .state('about',{
  url:'/about',
       templateUrl: 'templates/about.html',
          controller: 'aboutPageCntrlr'
  })
  

      .state('login',{
  url:'/login',
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
  })
  .state('register',{
url:'/register',
       
        templateUrl:'templates/register.html',
            controller:'signUpController'
       
})
  
  .state('main.dashboard',
         {
      url:'/dahsboard',
      abstract:true,
      views:{
       'Dashboard':{   
      templateUrl:'templates/tabs-dashboard.html',
      }
      }
  })
  

    .state('main.dashboard.weather',{
        url:'/weatherInfo',
          views: {
        'WeatherInfoPage': {
          templateUrl: 'templates/weatherInfo.html',
          controller: 'weatherCtrl'
        }
      }
    })
   .state('main.dashboard.history',{
        url:'/recentTrips',
          views: {
        'HistoryPage': {
          templateUrl: 'templates/historyPage.html',
          controller: 'historyCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

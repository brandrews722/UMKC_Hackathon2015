var appController = angular.module('doraa.controllers', [])

appController.controller('loginCtrl', function($scope,$state) {
$scope.login = function()
{
    $state.go('main.dashboard.weather');
}
})

appController.controller('signUpController', function($scope,$state) {
 
})

appController.controller('weatherCtrl', function($scope,$state) {
  
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
var services=angular.module('doraa.userServices', [])
 var userProfileURL="http://doraaServices.mybluemix.net/UserServices";
var userEmailServiceURL="https://mandrillapp.com/api/1.0/messages/send.json";
var userTripInfoServiceURL = "http://doraaServices.mybluemix.net/UserTripInfoService";
//This method would perform the logic of registering and login of the user.
services.service('appUserServices',function($http,$log,$state,$ionicLoading,$ionicPopup)
{
 var emailData={};
               emailData.key='4YWCTv7jRMAq0lwLg0DqBg';
               emailData.message={};
               emailData.message.from_email='TraWeaServices@umkc.edu';
               emailData.message.to=new Array();
                emailData.message.to[0]={};
               emailData.message.to[0].type='to';
               emailData.message.autotext='true';
               emailData.message.subject="TraWea services email verification mail.";
             
       return{
        registerUser:function(user,callBackMethod_Success){
        var result=$http.post(userProfileURL,user);
            result.success(function(data){
                
            if(data!=null && data!="" && data!="Failure" && data!="User already present")
            {

                callBackMethod_Success(data,user)
            }
                else
                {
                    showAlert("That's not right","A user with this username already exists. In case you forgot your password, please click on the forgot password link.");
                }
            })
            result.error(function(data)
            {
                errorResponse(data);
           
            })
        },
         login:function(username,callBackMethod_Success){
             var handle=$http.get(userProfileURL+"?userName="+username);
             handle.success(function(data){
                 if(data!=null && data!="" && data!="Failure" && data!="User not present"){
                    
                     callBackMethod_Success(data);
                 }
                 else{
                     document.getElementById('err_UserName').innerHTML="You do not have an account or your acccount might not be active.";
                      $ionicLoading.hide();  
                     if(document.getElementById('err_UserName').classList.contains('hide')){
                     document.getElementById('err_UserName').classList.remove('hide');
                     }
                      document.getElementById('txt_UserName').disabled=false;
                  //errorResponse(data,status,headers,config);
                 }
             });
             handle.error(function(data){
                errorResponse(data);
             });
    },
           emailUser:function(userData,callBackMethod_Success)
           {
              
                emailData.message.to[0].email=userData.userName;
               emailData.message.to[0].name=userData.name;
               emailData.message.html='Hi ' + userData.name + '. Thanks for registering with TraWea. To login to the Doraa application your username would be your email ID and the password for your account is <p "style=bold">'+userData.password  +'</p>';
               var handle = $http.post(userEmailServiceURL,emailData);
               handle.success(function(result,status){
                   if(result!=null && result[0]!=null && result[0].status!=null && result[0].status.toUpperCase()=='SENT')
                {
                callBackMethod_Success(result);   
                }
                   else
                   {
                        errorResponse(result);
                   }
               });
               handle.error(function(result){
               errorResponse(result);
               });
                
           },
           deactivateUser:function(userData,callBackMethod_Success)
           {
               var handle=$http.post(userProfileURL+"?deactivate=true",userData);
               handle.success(function(result)
                              {
                   callBackMethod_Success(result);
               });
                              handle.error(function(result)
               {
                   errorResponse(result);
               });
           },
      
    }   
       function errorResponse(data)
{               $log.info(data);
                $ionicLoading.hide();  
                   showAlert('Something went wrong','We apologize for the inconvenience. Please try again later.');
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

services.service('userTripInfoServices',function($http,$log,$state, $ionicLoading,$ionicPopup)
                 {
     return{
        getUserTrips:function(userName,callBackMethod_Success)
         {
             var handle=$http.get(userTripInfoServiceURL+ "?userName="+userName); 
             handle.success(function(result)
             {
                 if(result!=null && result!=""){
                 callBackMethod_Success(result);
                 }
                 else{
                 errorResponse(result);
                 }
                     
             });
             handle.error(function(result)
                          {
                 errorResponse(result);
             });
         },
         saveUserTrip:function(tripData,callBackMethod_Success)
         {
             var handle=$http.post(userTripInfoServiceURL,tripData);
             handle.success(function(result)
             {
                 callBackMethod_Success(result);
             });
             handle.error(function(result)
                          {
                 errorResponse(result);
             });
         },
         
    }   
    
   function errorResponse(data)
{
     $log.info(data);  
     $ionicLoading.hide();  
   showAlert();   
}
   function showAlert() {
   var alertPopup = $ionicPopup.alert({
     title: 'Something went wrong',
     template: 'We apologize for the inconvenience. Please try again later'
   });
   alertPopup.then(function(res) {
     console.log('There was some problem');
   });
 }
})

var services=angular.module('doraa.userServices', [])
 var userProfileURL="http://doraaServices.mybluemix.net/UserServices";
var userEmailService="https://mandrillapp.com/api/1.0/messages/send.json";

//This method would perform the logic of registering and login of the user.
services.service('appUserServices',function($http,$log,$state)
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
            result.success(function(data,status,headers,config){
                
            if(data!=null && data!="" && data!="Failure" && data!="User already present")
            {

                callBackMethod_Success(data,user)
            }
                else
                {
                    alert("A user with this username already exists. In case you forgot your password, please click on the forgot password link");
                }
            })
            result.error(function(data,status,headers,config)
            {
                errorResponse(data,status,headers,config);
           
            })
        },
         login:function(username,callBackMethod_Success){
             var handle=$http.get(userProfileURL+"?userName="+username);
             handle.success(function(data,status,headers,config){
                 if(data!=null && data!="" && data!="Failure" && data!="User not present"){
                    
                     callBackMethod_Success(data);
                 }
                 else{
                     document.getElementById('err_UserName').innerHTML="You do not have an account or your acccount might not be active.";
                     if(document.getElementById('err_UserName').classList.contains('hide')){
                     document.getElementById('err_UserName').classList.remove('hide');
                     }
                      document.getElementById('txt_UserName').disabled=false;
                  //errorResponse(data,status,headers,config);
                 }
             });
             handle.error(function(data,status,headers,config){
                errorResponse(data,status,headers,config);
             });
    },
           emailUser:function(userData,callBackMethod_Success)
           {
              
                emailData.message.to[0].email=userData.userName;
               emailData.message.to[0].name=userData.name;
               emailData.message.html='Hi ' + userData.name + '. Thanks for registering with TraWea. To login to the Doraa application your username would be your email ID and the password for your account is <p "style=bold">'+userData.password  +'</p>';
               var handle = $http.post(userEmailService,emailData);
               handle.success(function(result,status){
                   if(result!=null && result[0]!=null && result[0].status!=null && result[0].status.toUpperCase()=='SENT')
                {
                callBackMethod_Success(result);   
                }
                   else
                   {
                        errorResponse(result,null,null,null);
                   }
               });
               handle.error(function(result){
               errorResponse(result,null,null,null);
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
                   errorResponse(result,null,null,null);
               });
           },
      
    }   
       function errorResponse(data,status,headers,config)
{
                $log.info(data);
                 $log.info(headers);
                alert("There was some problem. Please try again later");   
}
})

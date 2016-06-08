(function(){

    angular.module('youtubeSearchApp').service('AuthService', [ '$window', function($window){

        /**
         * {
  "audience":"8819981768.apps.googleusercontent.com",
  "user_id":"123456789",
  "scope":"https://www.googleapis.com/auth/youtube",
  "expires_in":436,
  "access_token : 'tokenvaluegoeshere'
}
         */
        var Auth = {};

        var service = {};

        service.setAuth = function(authObject){
            Auth = authObject
        };

        service.getAuth = function(){
            return Auth;
        };

        service.isLoggedIn = function(){
          return Auth.user;
        };

        service.logout = function(){
            Auth = {};
        };

        service.authorize = function(){
            location.href = 'https://accounts.google.com/o/oauth2/auth?client_id=613015363976-0aodg2ib3dmv8m2g7gmknnglg29cmir9.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauthcallback&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner&response_type=token';
        };


        return service;
    }])

})();
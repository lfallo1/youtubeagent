(function(){

    angular.module('youtubeSearchApp').service('AuthService', [ '$window', '$log', function($window, $log){

        /**
         * {
  "audience":"8819981768.apps.googleusercontent.com",
  "user_id":"123456789",
  "scope":"https://www.googleapis.com/auth/youtube",
  "expires_in":436,
  "access_token : 'tokenvaluegoeshere'
}
         */
        var Auth;

        var service = {};

        service.setAuth = function(authObject){
            Auth = authObject
        };

        service.getAuth = function(){
            return Auth;
        };

        service.isLoggedIn = function(){
          return !!Auth;
        };

        service.logout = function(){
            Auth = undefined;
        };

        service.onSignIn = function(user){
            service.setAuth(user);
        };


        return service;
    }])

})();
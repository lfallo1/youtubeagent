(function(){

    angular.module('youtubeSearchApp').service('AuthService', [ '$window', '$log', function($window, $log){
        var newToken = undefined;

        var service = {};

        service.isLoggedIn = function(){
            return typeof gapi !== 'undefined' && gapi.auth2 && gapi.auth2.getAuthInstance().isSignedIn.hg;
        };

        service.onSignIn = function(user){
            if(newToken){
                gapi.auth2.getAuthInstance().currentUser.get().hg.access_token = newToken;
            }
        };

        service.setNewToken = function(token){
          newToken = token;
        };

        return service;
    }])

})();
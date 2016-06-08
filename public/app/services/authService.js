/**
 * AuthService.js - handle basic auth management (most of this is handled by the google api itself
 */
(function(){

    angular.module('youtubeSearchApp').service('AuthService', [ '$window', '$log', function($window, $log){
        var newToken = undefined;

        var service = {};

        /**
         * helper method returning if user is logged in (certain elements are hidden if not logged in)
         * @returns {boolean|*}
         */
        service.isLoggedIn = function(){
            return typeof gapi !== 'undefined' && gapi.auth2 && gapi.auth2.getAuthInstance().isSignedIn.hg;
        };

        /**
         * handle gapi onSignIn event
         * @param user
         */
        service.onSignIn = function(user){
            if(newToken){
                gapi.auth2.getAuthInstance().currentUser.get().hg.access_token = newToken;
            }
        };

        /**
         * set a "new" token.
         * in the onSignIn handler, the access_token may be updated to the current access_token
         * @param token
         */
        service.setNewToken = function(token){
          newToken = token;
        };

        return service;
    }])

})();
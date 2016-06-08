/**
 * AuthHandlerCtrl - this view gets hit after granting app access to youtube account
 */
(function() {
    angular.module('youtubeSearchApp').controller('AuthHandlerCtrl', [
        '$rootScope', '$scope', '$log', '$http', '$timeout', '$location', 'AuthService', 'toaster',
        function ($rootScope, $scope, $log, $http, $timeout, $location, AuthService, toaster) {

            //add to end of digest loop
            $timeout(function () {

                //get hash portion of url
                var hash = $location.$$hash.replace('access_token=', '');

                //get the first part
                var access_token = hash.split('&')[0];

                //if google api already initialized, then update the access_token to the newly acquired one
                if(gapi.auth2 && gapi.auth2.getAuthInstance){
                    gapi.auth2.getAuthInstance().currentUser.get().hg.access_token = newToken;
                    $location.path('/');
                    return;
                }

                //otherwise, save it in the service.  it will be set whenever the google api gets initialized
                AuthService.setNewToken(access_token);
                $location.path('/');
            }, 10);

        }]);
})();
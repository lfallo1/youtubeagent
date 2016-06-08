
(function() {
    angular.module('youtubeSearchApp').controller('AuthHandlerCtrl', [
        '$rootScope', '$scope', '$log', '$http', '$timeout', '$location', 'AuthService', 'toaster',
        function ($rootScope, $scope, $log, $http, $timeout, $location, AuthService, toaster) {

            $timeout(function () {
                var hash = $location.$$hash.replace('access_token=', '');
                var access_token = hash.split('&')[0];
                if(gapi.auth2 && gapi.auth2.getAuthInstance){
                    gapi.auth2.getAuthInstance().currentUser.get().hg.access_token = newToken;
                    $location.path('/');
                    return;
                }
                AuthService.setNewToken(access_token);
                $location.path('/');
            }, 10);

        }]);
})();
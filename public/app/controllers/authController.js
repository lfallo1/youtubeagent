(function(){
    angular.module('youtubeSearchApp').controller('AuthCtrl', [
        '$rootScope', '$scope', '$state', '$http', '$q', '$log', '$timeout', 'TimeService', 'toaster', '$window',
        function($rootScope, $scope, $state, $http, $q, $log, $timeout, TimeService, toaster, $window){

            var init = function(){
              console.log('pause');
            };

            init();

        }]);
})();

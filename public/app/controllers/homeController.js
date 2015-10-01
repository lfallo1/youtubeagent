(function(){
    angular.module('nodeAngularDemoApp').controller('HomeCtrl', [
        '$rootScope', '$scope', '$state', '$log', 'UserResource',
        function($rootScope, $scope, $state, $log, UserResource){

            $scope.init = function(){
                $scope.pageTitle = 'Welcome to the Home Page';
                $log.debug($state.current.myData.data1 + ' ' + $state.current.myData.data2);
                UserResource.getAll().$promise.then(function(data){
                    $log.debug(data);
                }, function(err){
                    $log.debug(err);
                });
            };

            $scope.linkMembers = function(){
                $state.go('users');
            };

            $scope.init();
        }]);
})();

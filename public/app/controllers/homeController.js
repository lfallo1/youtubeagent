(function(){
    angular.module('nodeAngularDemoApp').controller('HomeCtrl', [
        '$rootScope', '$scope', '$state', '$log', 'myUsers',
        function($rootScope, $scope, $state, $log, myUsers){

            $scope.init = function(){
                $scope.pageTitle = 'Welcome to the Home Page';
                $log.debug($state.current.myData.data1 + ' ' + $state.current.myData.data2);
                $log.debug(myUsers);
            };

            $scope.linkMembers = function(){
                $state.go('users');
            };

            $scope.init();
        }]);
})();

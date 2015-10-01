(function(){
    angular.module('nodeAngularDemoApp').controller('HomeCtrl', [
        '$rootScope', '$scope', '$state',
        function($rootScope, $scope, $state){

            $scope.init = function(){
                $scope.pageTitle = 'Welcome to the Home Page';
            };

            $scope.linkMembers = function(){
                $state.go('users');
            };

            $scope.init();
        }]);
})();

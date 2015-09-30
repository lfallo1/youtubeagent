(function(){
    angular.module('nodeAngularDemoApp').controller('HomeCtrl', [
        '$rootScope', '$scope', '$location',
        function($rootScope, $scope, $location){

            $scope.init = function(){
                $scope.pageTitle = 'Welcome to the Home Page';
            };

            $scope.linkMembers = function(){
                $location.path('/users');
            };

            $scope.init();
        }]);
})();

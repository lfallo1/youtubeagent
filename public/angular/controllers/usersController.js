(function(){
    angular.module('nodeAngularDemoApp').controller('UsersCtrl', [
        '$rootScope', '$scope', '$location', '$http',
        function($rootScope, $scope, $location, $http){

            $scope.users = [];

            $scope.init = function(){
                $scope.pageTitle = 'Welcome to the Users info page';
                $http.get('/api/users').then(function(res){
                    $scope.users = res.data;
                }, function(err){
                    console.log(err.status);
                })
            };

            $scope.linkHome = function(){
                $location.path('/');
            };

            $scope.init();
        }]);
})();

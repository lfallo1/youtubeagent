(function(){
    angular.module('nodeAngularDemoApp').controller('UsersCtrl', [
        '$rootScope', '$scope', '$http', '$state',
        function($rootScope, $scope, $http, $state){

            $scope.users = [];

            $scope.init = function(){
                $scope.pageTitle = 'Welcome to the Users info page';
                $http.get('/api/users').then(function(res){
                    $scope.users = res.data;
                }, function(err){
                    console.log(err.status);
                })
            };

            $scope.viewDetails = function(name){
                //$location.path('/user/' + name);
                $state.go('user', { name: name });
            };

            $scope.linkHome = function(){
                $state.go('home');
            };

            $scope.init();
        }]);
})();
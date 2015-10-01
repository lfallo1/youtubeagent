(function(){
    angular.module('nodeAngularDemoApp').controller('UserDetailController', [
        '$rootScope', '$scope', '$http', '$state', '$stateParams',
        function($rootScope, $scope, $http, $state, $stateParams){

            $scope.user = {};

            $scope.init = function(){
                $http.get('/api/users/' + $stateParams.name).then(function(res){
                    $scope.user = res.data;
                }, function(err){
                    console.log(err.status);
                })
            };

            $scope.linkHome = function(){
                $state.go('home');
            };

            $scope.init();
        }]);
})();

(function(){
    angular.module('nodeAngularDemoApp').controller('UserDetailController', [
        '$rootScope', '$scope', '$location', '$http', /* '$routeParams', */ '$stateParams',
        function($rootScope, $scope, $location, $http, $stateParams){

            $scope.user = {};

            $scope.init = function(){
                $http.get('/api/users/' + $stateParams.name).then(function(res){
                    $scope.user = res.data;
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

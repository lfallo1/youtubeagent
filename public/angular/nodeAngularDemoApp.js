(function() {
    var myApp = angular.module('nodeAngularDemoApp', [
        'ngRoute'
    ]);

    myApp.config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/', {
            templateUrl : 'home',
            controller : 'HomeCtrl'
        });

        $routeProvider.when('/users', {
            templateUrl : 'users',
            controller : 'UsersCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });

    }])
    .run(['$rootScope', '$location', function($rootScope, $location){
        console.log('run any additional setup here...');
    }]);

}());

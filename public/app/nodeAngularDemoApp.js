(function() {
    var myApp = angular.module('nodeAngularDemoApp', [
        'ngRoute'
    ]);

    myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when('/', {
            templateUrl : 'home',
            controller : 'HomeCtrl'
        });

        $routeProvider.when('/users', {
            templateUrl : 'users',
            controller : 'UsersCtrl'
        }, function(){ console.log('routeProvider: Users');});

        $routeProvider.otherwise('/');

    }])
    .run(['$rootScope', '$location', function($rootScope, $location){
        console.log('run any additional setup here...');
    }]);

}());

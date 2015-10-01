'use strict';

// Declare app level module which depends on filters, and services
angular.module('nodeAngularDemoApp', ['ngRoute']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/home',
                controller: 'HomeCtrl'
            }).
            when('/users', {
                templateUrl: 'partials/users',
                controller: 'UsersCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }]).run(['$rootScope', '$location', function($rootScope, $location){
        console.log('run any additional setup here...');
    }]);;
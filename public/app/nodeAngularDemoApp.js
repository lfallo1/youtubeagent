'use strict';

angular.module('nodeAngularDemoApp', ['ui.router']).
    config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.
            state('home', {
                url : '/',
                templateUrl: 'partials/home',
                controller: 'HomeCtrl'
            }).
            state('users', {
                url : '/users',
                templateUrl: 'partials/users',
                controller: 'UsersCtrl'
            }).
            state('user', {
                url : '/users/:name',
                templateUrl : '/static/app/htmlTemplates/user.html',
                controller : 'UserDetailController'
            });
        $locationProvider.html5Mode(true);
    }]).run(['$rootScope', '$location', '$log', function($rootScope, $location, $log){

        //TODO

    }]);
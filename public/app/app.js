'use strict';

angular.module('youtubeSearchApp', ['ui.router','ngRoute']).
    config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$routeProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $routeProvider) {

        $routeProvider.
            when('/', {
                templateUrl : 'partials/home',
                controller: 'HomeCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    }]).run(['$rootScope', '$location', '$log', function($rootScope, $location, $log){

        //TODO

    }]);
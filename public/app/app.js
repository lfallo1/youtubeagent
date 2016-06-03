'use strict';

angular.module('youtubeSearchApp', ['ui.router']).
    config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.
            state('home', {
                url : '/',
                templateUrl : '/partials/home',
                controller: 'HomeCtrl'
            });

        $locationProvider.html5Mode(true);
    }]).run(['$rootScope', '$location', '$log', function($rootScope, $location, $log){

        //TODO

    }]);
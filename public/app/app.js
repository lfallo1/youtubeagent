'use strict';

angular.module('nodeAngularDemoApp', ['apiServices', 'ui.router']).
    config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.
            state('home', {
                url : '/',
                templateUrl : '/static/app/views/home.html',
                controller: 'HomeCtrl'
            });

        $locationProvider.html5Mode(true);
    }]).run(['$rootScope', '$location', '$log', function($rootScope, $location, $log){

        //TODO

    }]);
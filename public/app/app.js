'use strict';

angular.module('youtubeSearchApp', ['ui.router','ngRoute', 'ngAnimate', 'toaster']).
    config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$routeProvider', '$httpProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $routeProvider, $httpProvider) {

        //$httpProvider.interceptors.push('httpRequestInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $routeProvider.
            when('/', {
                templateUrl : 'partials/home',
                controller: 'HomeCtrl'
            }).
            when('/oauthcallback', {
               templateUrl : 'partials/auth',
                controller : 'AuthCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    }]).run(['$rootScope', '$location', '$log', function($rootScope, $location, $log){

        //TODO

    }]);
'use strict';

angular.module('youtubeSearchApp', ['ui.router','ngRoute', 'ngAnimate', 'toaster', 'ui.bootstrap']).
    config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$routeProvider', '$httpProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $routeProvider, $httpProvider) {

        //$httpProvider.interceptors.push('httpRequestInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        delete $httpProvider.defaults.headers.common['X-Frame-Options'];

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
    }]).run(['$rootScope', '$location', '$log', 'AuthService', '$uibModal', function($rootScope, $location, $log, AuthService, $uibModal){

        $rootScope.AuthService = AuthService;

        $rootScope.authorize = function(){
            if(AuthService.isLoggedIn()){
                return;
            }
            location.href = "https://accounts.google.com/o/oauth2/auth?client_id=613015363976-0aodg2ib3dmv8m2g7gmknnglg29cmir9.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauthcallback&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner&response_type=token";
        };

    }]);
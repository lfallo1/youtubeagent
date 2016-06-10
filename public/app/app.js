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
               templateUrl : 'partials/authHandler',
                controller : 'AuthHandlerCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    }]).run(['$rootScope', '$log', 'AuthService', function($rootScope, $log, AuthService){

        //live
        //$rootScope.clientId = "613015363976-vt1eeel6upnq26k2haupepbdtpd2bjgj.apps.googleusercontent.com";
        //$rootScope.authCallbackUrl = "http://www.youtubeagent.io/oauthcallback";
        //$rootScope.apiKey = "AIzaSyAdvomXbhYg3GeBGymbPVBg-aRJeIOfFyQ";

        //local
        $rootScope.clientId = "613015363976-0aodg2ib3dmv8m2g7gmknnglg29cmir9.apps.googleusercontent.com";
        $rootScope.authCallbackUrl = "http://localhost:3000/oauthcallback";
        $rootScope.apiKey = "AIzaSyB3v4vF0MIHB00iTr4lAxW2ONwZNmTR0HM";

        //set AuthService on rootScope for convenience (still placing AuthService in its service for modularity)
        $rootScope.AuthService = AuthService;

        //set the onSignIn event on the window object
        window.onSignIn = AuthService.onSignIn;

    }]);
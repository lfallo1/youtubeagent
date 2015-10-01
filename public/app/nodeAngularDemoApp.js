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

        //$rootScope.$on('$routeChangeSuccess', function(event, current, previous){
        //    $log.debug('changed routes');
        //    $log.debug(event);
        //    $log.debug(current);
        //    $log.debug(previous);
        //
        //    $log.debug($route.current);
        //    $log.debug($route.routes);
        //});
        //
        //$rootScope.$on('$routeChangeError', function(event, current, previous, error){
        //    $log.debug('Error!');
        //    $log.debug(error);
        //    if(previous){
        //        $location.path(previous.$$route.originalPath);
        //    }
        //});

    }]);

//// Declare app level module
//angular.module('nodeAngularDemoApp', ['ngRoute']).
//    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
//
//        //RouteProvider that utilizes both static and non-static templateURLs (aka, some will be resolved by express using the static resource manager. While the others will use the custom route mapping defined the app.get(...) functions
//        $routeProvider.
//            when('/', {
//                templateUrl: 'partials/home',
//                controller: 'HomeCtrl'
//            }).
//            when('/users', {
//                templateUrl: 'partials/users',
//                controller: 'UsersCtrl',
//                resolve: {
//                    "userStats": function($q, $timeout) {
//                        return $timeout(function() {
//                            return {
//                                statsMain: function() {
//                                    return "User stats have loaded";
//                                },
//                                statsExtra: function() {
//                                    return "... this could be data that took 1 second to load";
//                                }
//                            };
//                        }, 1000);
//                    },
//                    "addlUserStuff" : function(){
//                        return {
//                            'names' : 'This is the names property',
//                            'location' : 'United States'
//                        }
//                    }
//                }
//            }).
//            when('/user/:name', {
//                templateUrl : '/static/app/htmlTemplates/user.html',
//                controller : 'UserDetailController'
//            }).
//            otherwise({
//                redirectTo: '/'
//            });
//        $locationProvider.html5Mode(true);
//    }]).run(['$rootScope', '$location', '$route', '$log', function($rootScope, $location, $route, $log){
//
//        $rootScope.$on('$routeChangeSuccess', function(event, current, previous){
//            $log.debug('changed routes');
//            $log.debug(event);
//            $log.debug(current);
//            $log.debug(previous);
//
//            $log.debug($route.current);
//            $log.debug($route.routes);
//        });
//
//        $rootScope.$on('$routeChangeError', function(event, current, previous, error){
//            $log.debug('Error!');
//            $log.debug(error);
//           if(previous){
//               $location.path(previous.$$route.originalPath);
//           }
//        });
//
//    }]);
(function() {
    var myApp = angular.module('nodeAngularDemoApp', [
        'ngRoute',
    ]);

    myApp.config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/', {
            templateUrl : 'home',
            controller : 'HomeCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });

    }])
    .run(['$rootScope', '$location', 'ApplicationState', function($rootScope, $location, ApplicationState){
        console.log('run any additional setup here...');
    }]);
}());

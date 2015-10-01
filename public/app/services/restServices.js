(function() {
    var restServices = angular.module('apiServices', ['ngResource']);

    restServices.service('UserResource', ['$resource', function($resource) {
        return $resource("api/users/:id", {}, {
            getAll: {
                method: "GET",
                url:"api/users", isArray: true
            },
            getByName: {
                method: "GET",
                url:"api/users/:name", isArray: false
            }
        });
    }]);
})();
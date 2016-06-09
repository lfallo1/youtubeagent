(function(){

    angular.module('youtubeSearchApp').service('CountriesService', ['$http', '$q', '$log', function($http, $q, $log){
        var service = {};

        var countries = [];

        service.getCountries = function(){
            var deferred = $q.defer();
            if(countries.length > 0){
                deferred.resolve(countries);
                return;
            }
          $http.get('api/countries').then(function(res){
              $log.info(res);
              countries = res.data;
              deferred.resolve(countries);
          }, function(err){
             $log.error(err);
              deferred.reject();
          });
            return deferred.promise;
        };

        service.getCountryByCode = function(alpha){
          return countries.filter(function(d) {
              if (d['alpha-2'] === alpha) {
                  return d;
              }
          })[0];
        };

        return service;
    }]);

})();

(function() {
    angular.module('youtubeSearchApp').service('TimeService', ['$log', function timeService($log) {

        var service = {};

        service.isoToDuration = function(duration) {
            var myRegexp = duration.indexOf('H') > -1 ? /PT(\d+)H(\d+)M(\d+)S/g : duration.indexOf('M') > -1 ? /PT(\d+)M(\d+)S/g : /PT(\d+)S/g;
            var match = myRegexp.exec(duration);
            var formattedDuration;
            var approxMinutes;
            if(match && match.length){
                formattedDuration = '';
                approxMinutes = 0;
                for(var i = 1; i < match.length; i++) {
                    formattedDuration += match[i] < 9 ? '0' + match[i] : match[i];
                    if (i != match.length - 1) {
                        formattedDuration += ':';
                        approxMinutes += match.length - i === 3 ? Number(match[i]) * 60 : match.length - i === 2 ? Number(match[i]) : 0;
                    }
                }
            }
            return {
                'formatted' : formattedDuration,
                'approxMinutes' : approxMinutes
            }
        }

        return service;
    }]);

})();
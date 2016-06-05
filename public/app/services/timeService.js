(function() {
    angular.module('youtubeSearchApp').service('TimeService', ['$log', function timeService($log) {

        var service = {};

        function MyTime(h,m,s){
            this.h = h;
            this.m = m;
            this.s = s;

            this.formatted = function(){
                var hours = !this.h ? '00' : Number(this.h) < 10 ? '0' + this.h : this.h;
                var minutes = !this.m ? '00' : Number(this.m) < 10 ? '0' + this.m : this.m;
                var seconds = !this.s ? '00' : Number(this.s) < 10 ? '0' + this.s : this.s;
                return hours + ':' + minutes + ':' + seconds;
            }
        }

        service.isoToDuration = function(duration) {
            var hours, minutes, seconds = null;
            var approxMinutes = 0;

            var stripped = duration.replace("PT","");
            var number = '';
            var char = '';
            for(var i = 0; i < stripped.length; i++) {
                char = stripped.substring(i, i + 1);
                if (isNaN(char)) {
                    switch (char) {
                        case 'H':
                            approxMinutes += Number(number) * 60;
                            hours = number;
                            break;
                        case 'M':
                            approxMinutes += Number(number);
                            minutes = number;
                            break;
                        case 'S':
                            approxMinutes += 1;
                            seconds = number;
                            break;
                        default:
                            break;
                    }
                    number = '';
                }
                else{
                    number = number.toString() + char.toString();
                }
            }
            time = new MyTime(hours, minutes, seconds);
            return {
                'formatted' : time.formatted(),
                'approxMinutes' : approxMinutes
            }
        };

        return service;
    }]);

})();
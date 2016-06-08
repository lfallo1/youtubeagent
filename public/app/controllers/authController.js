(function(){
    angular.module('youtubeSearchApp').controller('AuthCtrl', [
        '$rootScope', '$scope', '$log', '$http', '$timeout','$location', 'AuthService', 'toaster',
        function($rootScope, $scope, $log, $http, $timeout, $location, AuthService, toaster){

            $timeout(function(){
                var access_token = $location.$$hash.replace('access_token=','');
                $http.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + access_token).then(function(res){
                    $log.info(res);
                    res.data.access_token = access_token;
                    var Auth = res.data;
                    var url = 'https://www.googleapis.com/youtube/v3/channels?part=id,snippet,contentDetails&mine=true&access_token=' + access_token;

                    $http.get(url).then(function(res){
                        var name = res.data.items[0].snippet.title;
                        var channelId = res.data.items[0].id;
                        var user = {
                            'name' : name,
                            'id' : channelId
                        };
                        Auth.user = user;
                        AuthService.setAuth(Auth);
                        toaster.pop('success', '', 'Using app as ' + Auth.user.name);
                        $location.path('/');
                        return;
                    })

                }, function(err){
                    // {"error":"invalid_token"}
                    $log.error(err);
                })

            }, 10);

        }]);
})();

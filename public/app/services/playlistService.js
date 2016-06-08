(function(){
    angular.module('youtubeSearchApp').service('PlaylistService', ['$http', '$q', '$log', '$uibModal', 'toaster', 'AuthService', function($http, $q, $log, $uibModal, toaster, AuthService){

        var service = {};

        var generatePlaylistItemResource = function(video, playlist){
            return {
                'snippet' : {
                    'playlistId' : playlist.id,
                    'resourceId' : {
                        'videoId' : video.videoId,
                        'kind' : 'youtube#video'
                    }
                }
            };
        };

        var generatePlaylistResource = function(playlistName){
          return {
              'snippet' : {
                  'title' : playlistName
              }
          }
        };

        service.loadPlaylists = function(){

            var deferred = $q.defer();
            var token = gapi.auth2.getAuthInstance().currentUser.get().hg.access_token;
            var url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,id&mine=true&maxResults=50&access_token=' + token;
            $http.get(url).then(function(res){
                $log.info(res);
                deferred.resolve(res.data.items);
            }, function(err){
                $log.error(err);
                if(err.status === 401 || err.status === 403){
                    location.href = "https://accounts.google.com/o/oauth2/auth?client_id=" + $rootScope.clientId + "&redirect_uri=" + $rootScope.authCallbackUrl + "&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner&response_type=token";
                }
                else if(err.status === 404){
                    toaster.pop('info', '', 'Looks like you haven\'t setup a YouTube channel yet.  Once you get one setup, give this another try');
                    ;                }
                deferred.reject();
            });
            return deferred.promise
        };

        service.addPlaylist = function(playlistName){
            var deferred = $q.defer();
            var token = gapi.auth2.getAuthInstance().currentUser.get().hg.access_token;
            var url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet&access_token=' + token;
            var playlistResource = generatePlaylistResource(playlistName);
            $http.post(url, playlistResource).then(function(res){
                deferred.resolve(res.data);
            }, function(err){
                $log.error(err);
                deferred.reject(err);
            });
            return deferred.promise;
        };

        service.addToPlaylist = function(video){

            if(!AuthService.isLoggedIn()){
                return;
            }

            service.loadPlaylists().then(function(playlists){

                var modalInstance = $uibModal.open({
                    templateUrl: 'partials/playlistModal.html',
                    controller: 'PlaylistModalCtrl',
                    size: 'sm',
                    resolve: {
                        content: function () {
                            return {
                                'playlists' : playlists
                            }
                        }
                    }
                });

                //handle promise resolve/reject
                modalInstance.result.then(function (selectedPlaylist) {
                    var token = gapi.auth2.getAuthInstance().currentUser.get().hg.access_token;
                    var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&access_token=' + token;
                    var playlistItemResource = generatePlaylistItemResource(video, selectedPlaylist);
                    $http.post(url, playlistItemResource).then(function(res){
                        $log.info(res);
                        toaster.pop('success', '', 'Awww yea, added to your playlist!');
                    }, function(err){
                        $log.error(err);
                        toaster.pop('error', '', 'Bummer, something terrible happened and we could not add the video');
                    });
                }, function (err) {
                    //TODO
                    $log.error(err);
                });
            })
        };

        return service;
    }]);
})();
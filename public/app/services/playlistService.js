(function(){
    angular.module('youtubeSearchApp').service('PlaylistService', ['$http', '$q', '$log', '$uibModal', 'toaster', 'AuthService', function($http, $q, $log, $uibModal, toaster, AuthService){
        //api calls (refactor later)

        var playlists = [];

        var service = {};

        var loadPlaylists = function(){
            var deferred = $q.defer();
            var token = gapi.auth2.getAuthInstance().currentUser.get().hg.access_token;
            var url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,id&mine=true&access_token=' + token;
            $http.get(url).then(function(res){
                $log.info(res);
                deferred.resolve(res.data.items);
            }, function(err){
                $log.error(err);
                if(err.status === 401 || err.status === 403){
                    //location.href = "https://accounts.google.com/o/oauth2/auth?client_id=613015363976-0aodg2ib3dmv8m2g7gmknnglg29cmir9.apps.googleusercontent.com&redirect_uri=http://localhost:3000/oauthcallback&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner&response_type=token";
                    location.href = "https://accounts.google.com/o/oauth2/auth?client_id=613015363976-0aodg2ib3dmv8m2g7gmknnglg29cmir9.apps.googleusercontent.com&redirect_uri=http://www.youtubeagent.io/oauthcallback&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner&response_type=token";
                }
                else if(err.status === 404){
                    toaster.pop('info', '', 'Looks like you haven\'t setup a YouTube channel yet.  Once you get one setup, give this another try');
;                }
                deferred.reject();
            });
            return deferred.promise
        };

        service.getPlaylists = function(){
          return playlists;
        };

        service.generatePlaylistItemResource = function(video, playlist){
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

        service.generatePlaylistResource = function(playlistName){
          return {
              'snippet' : {
                  'title' : playlistName
              }
          }
        };

        var isInPlaylist = function(video, playlist){
            //TODO - maybe
            return false;
        };

        service.addToPlaylist = function(video){

            if(!AuthService.isLoggedIn()){
                return;
            }

            loadPlaylists().then(function(playlists){

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
                    var playlistItemResource = service.generatePlaylistItemResource(video, selectedPlaylist);
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
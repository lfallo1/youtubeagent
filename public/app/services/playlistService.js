/**
 * PlaylistService- Handle functionality related to creating / updating playlists
 */
(function(){
    angular.module('youtubeSearchApp').service('PlaylistService', ['$http', '$q', '$log', '$uibModal', 'toaster', 'AuthService', function($http, $q, $log, $uibModal, toaster, AuthService){

        var service = {};

        //generate a playlist item resource for body of request. Format is as specified by youtube api
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

        //generate a playlist resource for body of request. Format is as specified by youtube api
        var generatePlaylistResource = function(playlistName){
          return {
              'snippet' : {
                  'title' : playlistName
              }
          }
        };

        /**
         * load the users playlists. currently only grabbing first 50.
         * In future, could use next page token to get all playlists, but 50 seems like enough for now.
         * @returns {*}
         */
        service.loadPlaylists = function(){

            var deferred = $q.defer();

            //get token & create url
            var token = gapi.auth2.getAuthInstance().currentUser.get().hg.access_token;
            var url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,id&mine=true&maxResults=50&access_token=' + token;

            //perform request
            $http.get(url).then(function(res){
                $log.info(res);
                deferred.resolve(res.data.items);
            }, function(err){
                $log.error(err);

                //if no auth error, it means the user has not granted access to their youtube account.  Redirect to page, requesting
                //them allow access.
                if(err.status === 401 || err.status === 403){
                    location.href = "https://accounts.google.com/o/oauth2/auth?client_id=" + $rootScope.clientId + "&redirect_uri=" + $rootScope.authCallbackUrl + "&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner&response_type=token";
                }
                else if(err.status === 404){
                    //404 means they haven't setup a youtube channel / page yet.  just show a basic message asking them to do so
                    //if they want to use the playlist feature
                    toaster.pop('info', '', 'Looks like you haven\'t setup a YouTube channel yet.  Once you get one setup, give this another try');
                    ;                }
                deferred.reject();
            });
            return deferred.promise
        };

        /**
         * Add a new playlist to their channel
         * @param playlistName
         * @returns {*}
         */
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

        /**
         * Add a video to a playlist
         * @param video
         */
        service.addToPlaylist = function(video){

            if(!AuthService.isLoggedIn()){
                return;
            }

            /**
             * load all playlists then open a modal, passing the list of playlists as content
             */
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

                //handle promise resolve/reject. data is the selected playlist
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
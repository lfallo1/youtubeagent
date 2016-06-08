(function(){
    angular.module('youtubeSearchApp').service('PlaylistService', ['$http', '$q', '$log', '$uibModal', 'AuthService', function($http, $q, $log, $uibModal, AuthService){
        //api calls (refactor later)

        var playlists = [];

        var service = {};

        service.loadPlaylists = function(){
            var auth = AuthService.getAuth();
            var url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,id&mine=true&access_token=' + auth.hg.access_token;
            $http.get(url).then(function(res){
                playlists = res.data.items;
                $log.info(res);
            }, function(err){
                $log.error(err);
                if(err.status === 401 || err.status === 403){
                    location.href = "https://accounts.google.com/o/oauth2/auth?client_id=613015363976-0aodg2ib3dmv8m2g7gmknnglg29cmir9.apps.googleusercontent.com&redirect_uri=http://localhost:3000/&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner&response_type=token";
                }
            });
        };

        service.getPlaylists = function(){
          return playlists;
        };

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
        }

        var isInPlaylist = function(video, playlist){
            //TODO - maybe
            return false;
        };

        service.addToPlaylist = function(video){

            if(!AuthService.isLoggedIn()){
                return;
            }

            var modalInstance = $uibModal.open({
                //TODO
            });

            //handle promise resolve/reject
            modalInstance.result.then(function (res) {
                //TODO
                $log.info(res);
            }, function (err) {
                //TODO
                $log.error(err);
            });

            //TODO after selecting playlist
            var selectedPlaylist = $scope.playlists[0];

            var auth = AuthService.getAuth();
            var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&access_token=' + auth.hg.access_token;
            var playlistItemResource = generatePlaylistItemResource(video, selectedPlaylist);
            $http.post(url, playlistItemResource).then(function(res){
                $log.info(res);
            }, function(err){
                $log.error(err);
                //TODO handle different types of errors (i.e., not checking for dp items in playlists, so might be helpful to display a message here for that specific error)
            });
        };

        return service;
    }]);
})();
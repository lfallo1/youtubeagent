(function(){
    angular.module('youtubeSearchApp').service('PlaylistService', ['$http', '$q', '$log', '$uibModal', 'AuthService', function($http, $q, $log, $uibModal, AuthService){
        //api calls (refactor later)

        var playlists = [];

        var service = {};

        service.loadPlaylists = function(){
            var auth = AuthService.getAuth();
            var url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,id&mine=true&access_token=' + auth.access_token;
            $http.get(url).then(function(res){
                playlists = res.data.items;
                $log.info(res);
            }, function(err){
                $log.error(err);
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
            var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&access_token=' + auth.access_token;
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
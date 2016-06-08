angular.module('youtubeSearchApp')
    .controller('PlaylistModalCtrl', ["$scope", "$uibModalInstance", "$http", "content", "PlaylistService", function ($scope, $uibModalInstance, $http, content, PlaylistService) {

        $scope.init = function(){
            $scope.playlists = content.playlists
        };

        $scope.setAddingPlaylist = function(val){
            $scope.addingPlaylist = val;
        };

        $scope.addPlaylist = function(){
            var token = gapi.auth2.getAuthInstance().currentUser.get().hg.access_token;
            var url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet&access_token=' + token;
            var playlistResource = PlaylistService.generatePlaylistResource($scope.newPlaylistName);
            $http.post(url, playlistResource).then(function(res){
                $scope.submit(res.data);
            }, function(err){
                $log.error(err);
            });
        };

        $scope.submit = function(playlist){
            $uibModalInstance.close(playlist);
        };

        $scope.cancel = function(){
            $uibModalInstance.dismiss();
        };

        $scope.init();

    }]);
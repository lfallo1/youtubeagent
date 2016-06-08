angular.module('youtubeSearchApp')
    .controller('PlaylistModalCtrl', ["$scope", "$uibModalInstance", "$http", "content", "PlaylistService", function ($scope, $uibModalInstance, $http, content, PlaylistService) {

        $scope.init = function(){
            $scope.playlists = content.playlists
        };

        $scope.setAddingPlaylist = function(val){
            $scope.addingPlaylist = val;
        };

        $scope.addPlaylist = function(){
            PlaylistService.addPlaylist($scope.newPlaylistName).then(function(newPlaylist){
                $scope.submit(newPlaylist);
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
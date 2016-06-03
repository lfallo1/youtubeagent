(function(){
    angular.module('nodeAngularDemoApp').controller('HomeCtrl', [
        '$rootScope', '$scope', '$state', '$http', '$q', '$log',
        function($rootScope, $scope, $state, $http, $q, $log){

            $scope.minDislikes = 3;
            $scope.totalResults = 0;
            $scope.searchParam = '';
            $scope.searchResults = [];

            var totalPages = 25;
            var nextPageToken = '';


            $scope.doSearch = function(){
                $scope.searchObj = [];
                $scope.searchParam = $scope.searchParam.replace(" ",",");
                nextPageToken = '';
                getPage();
            }

            var getPage = function(){
                $scope.pageResults = 0;
                var searchUrl = "https://www.googleapis.com/youtube/v3/search?"+ nextPageToken +"key=AIzaSyDE3EI_Yy2IKmN7aL0tVug3w-sR1tVnGwY&part=snippet&q="+ $scope.searchParam +"&type=video&maxResults=50&order=rating";

                $http.get(searchUrl).then(function(res){

                    //no results, then finish
                    if(!res.data || res.data.items.length === 0){
                        //TODO finish
                        return;
                    }

                    //otherwise, increment page and get the statistics for each returned video
                    $scope.pageResults++;
                    var promises = [];
                    for(var i = 0; i < data.items.length; i++){
                        promises.push($http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id="+ data.items[i].id.videoId +"&key=AIzaSyDE3EI_Yy2IKmN7aL0tVug3w-sR1tVnGwY'));
                    }

                    $q.all(promises).then(function(datastats){

                        //for each video, add to the list
                        for(var i = 0; i < datastats.length; i++){
                            var title = datastats.items[0].snippet.title;
                            var id = datastats.items[0].id;
                            var pctLikes = (Number(datastats.items[0].statistics.likeCount) / (Number(datastats.items[0].statistics.likeCount) + Number(datastats.items[0].statistics.dislikeCount))) * 100;
                            var viewCount = datastats.items[0].statistics.viewCount;
                            var likes = datastats.items[0].statistics.likeCount;
                            var dislikes = datastats.items[0].statistics.dislikeCount;
                            $scope.searchResults.push({
                                "title" : title,
                                "videoId" : id,
                                "pctLikes" : Number(pctLikes),
                                "viewCount" : Number(viewCount),
                                "likes" : Number(likes),
                                "dislikes" : Number(dislikes),
                                "thumbnail" : datastats.items[0].snippet.thumbnails.medium
                            });
                        }
                    })

                });
            };

        }]);
})();

(function(){
    angular.module('youtubeSearchApp').controller('HomeCtrl', [
        '$rootScope', '$scope', '$state', '$http', '$q', '$log', '$timeout',
        function($rootScope, $scope, $state, $http, $q, $log, $timeout){

            $scope.totalResults = 0;
            $scope.searchParam = '';
            $scope.searchResults = [];

            var apikey = "AIzaSyAdvomXbhYg3GeBGymbPVBg-aRJeIOfFyQ";
            var totalPages = 25;
            var nextPageToken = '';

            $scope.interrupt = function(){
              $scope.stop = true;
            };

            $scope.doSearch = function(){
                $scope.stop = undefined;
                $scope.searchResults = [];
                $scope.searchParam = $scope.searchParam.replace(" ",",");
                $scope.fetching = true;
                getPage();
            };

            $scope.sort = function(field, direction){
                $scope.searchResults = $scope.searchResults.sort(function(a,b){
                    return a[field] > b[field] ? direction : a[field] < b[field] ? -direction : 0;
                });
                $scope.filter();
            };

            $scope.filter = function(){
                if(!$scope.minDislikes){
                      return;
                }
                $scope.searchResults=  $scope.searchResults.filter(function(d){
                   if(d.dislikes <= $scope.minDislikes){
                       return d;
                   }
                });
            };

            var getPage = function(token){

                if($scope.stop){
                    $scope.fetching = false;
                    return;
                }

                var _nextPageToken = token ? 'pageToken=' + token + '&' : '';
                var searchUrl = "https://www.googleapis.com/youtube/v3/search?"+ _nextPageToken +"key="+ apikey +"&part=snippet&q="+ $scope.searchParam +"&type=video&maxResults=50&order=rating";

                $http.get(searchUrl).then(function(res){

                    //no results, then finish
                    if(!res.data || res.data.items.length === 0){
                        $scope.fetching = false;
                        return;
                    }

                    var nextPageToken = res.data.nextPageToken;

                    //otherwise, get the statistics for each returned video
                    var promises = [];
                    for(var i = 0; i < res.data.items.length; i++){
                        promises.push($http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id='+ res.data.items[i].id.videoId +'&key=' + apikey));
                    }

                    $q.all(promises).then(function(data){

                        //for each video, add to the list
                        for(var i = 0; i < data.length; i++){
                            var datastats = data[i].data;
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

                        $scope.sort('viewCount', -1);

                        if(!nextPageToken){
                            $scope.fetching = false;
                            return;
                        }

                        getPage(nextPageToken);
                    })

                });
            };

        }]);
})();

(function(){
    angular.module('youtubeSearchApp').controller('HomeCtrl', [
        '$rootScope', '$scope', '$state', '$http', '$q', '$log', '$timeout', 'TimeService', 'toaster',
        function($rootScope, $scope, $state, $http, $q, $log, $timeout, TimeService, toaster){


            var init = function(){
                $scope.totalResults = 0;
                $scope.searchParam = '';
                $scope.searchResults = $scope.filteredResults = [];

                $scope.sortOptions = [
                    new SortOption('viewCount', -1, 'user', 'Views'),
                    new SortOption('likes', -1, 'thumbs-up', 'Likes'),
                    new SortOption('dislikes', 1, 'thumbs-down', 'Dislikes'),
                    new SortOption('pctLikes', -1, 'star', 'Rating')
                ];
                $scope.sortField = $scope.sortOptions[0].value;
            };

            $scope.sortOptionChanged = function(option){
                $scope.sortField = option.value;
                $scope.sort();
            };

            //var apikey = "AIzaSyAdvomXbhYg3GeBGymbPVBg-aRJeIOfFyQ";
            var apikey = "AIzaSyB3v4vF0MIHB00iTr4lAxW2ONwZNmTR0HM";
            var sortOrders = [];

            function SortOption(value, direction, glyph, displayName){
                this.value = value;
                this.direction = direction;
                this.glyph = glyph;
                this.displayName = displayName;
            };

            $scope.interrupt = function(){
              $scope.stop = true;
                stopSearch('Search stopped', 'info');
                $scope.fetching = false;
            };

            var stopSearch = function(msg, toasterType){
                $scope.fetching = false;
                toaster.pop(toasterType, '', msg);
            };

            $scope.doSearch = function(){
                if($scope.fetching){
                    return;
                }

                $scope.searchParam = $scope.searchParam.trim();
                if($scope.searchParam){

                    sortOrders = [
                        {order : 'relevance', token : ''},
                        {order : 'rating', token : ''},
                        {order : 'date', token : ''},
                        {order : 'viewCount', token : ''}
                    ];
                    $scope.searchResults = [];

                    $scope.stop = undefined;
                    $scope.fetching = true;
                    fetchResults();
                }
            };

            $scope.sort = function(){
                var sortObject = $scope.sortOptions.filter(function(d){if(d.value === $scope.sortField){return d;}})[0];
                $scope.searchResults = $scope.searchResults.sort(function(a,b){
                    if(a[sortObject.value] > b[sortObject.value]){
                        return sortObject.direction;
                    } else if(a[sortObject.value] < b[sortObject.value]){
                        return -sortObject.direction;
                    }
                    return 0;
                });
                $scope.filter();
            };

            $scope.filter = function(){
                if(!$scope.minViews && !$scope.minDislikes && !$scope.minDate && !$scope.shorterThanFilter && !$scope.longerThanFilter && !$scope.minRating){
                    $scope.filteredResults = $scope.searchResults;
                    return;
                }
                $scope.filteredResults = $scope.searchResults.filter(function(d){
                   if((!$scope.minDislikes || d.dislikes <= $scope.minDislikes) &&
                       (!$scope.minViews || d.viewCount >= $scope.minViews) &&
                       (!$scope.minRating || d.pctLikes >= $scope.minRating) &&
                       (!$scope.minDate || d.created >= $scope.minDate) && durationFilter(d)){
                       return d;
                   }
                });
            };

            var durationFilter = function(video){
                //for clarity split up statements
                //1. if video.durationMinutes is not defined, then return true immediately
                //2. otherwise check the filters
                if(isNaN(video.durationMinutes) || !video.durationMinutes){
                  return true;
                }

                if($scope.longerThanFilter >= $scope.lessThanFilter || $scope.lessThanFilter < 0){
                    $scope.lessThanFilter = '';
                }

                if($scope.longerThanFilter < 0){
                    $scope.longerThanFilter = 0;
                }

                return (isNaN($scope.longerThanFilter) || video.durationMinutes >= $scope.longerThanFilter) &&
                    (isNaN($scope.lessThanFilter) || !$scope.lessThanFilter || video.durationMinutes <= $scope.lessThanFilter)
            };

            var fetchResults = function(){

                if($scope.stop){
                    return;
                }

                var promises = [];

                //for each sort order type, execute the GET request.  doing this so that more results are returned.
                for(var i = 0; i < sortOrders.length; i++){
                    var token = sortOrders[i].token ? 'pageToken=' + sortOrders[i].token + '&' : '';
                    promises.push($http.get("https://www.googleapis.com/youtube/v3/search?"+ token +"key="+ apikey +"&part=snippet&q="+ $scope.searchParam +"&type=video&maxResults=50&order="+ sortOrders[i].order))
                }

                //wait for all requests to complete
                $q.all(promises).then(function(res){

                    //no results, then finish
                    if(!res || res.length === 0){
                        stopSearch('Finished search', 'info');
                        return;
                    }

                    //no items in any results, then finish
                    var sum = 0;
                    res.forEach(function(d){
                        if(d.data && d.data.items){
                            sum+=d.data.items.length;
                        }
                    });
                    if(sum === 0){
                        stopSearch('Finished search', 'info');
                        return;
                    }

                    //otherwise there are items
                    var nonDuplicates = [];
                    for(var i = 0; i < res.length; i++){

                        //set next page token
                        var order = res[i].config.url.substring(res[i].config.url.lastIndexOf("=")+1);
                        for(var j = 0; j < sortOrders.length; j++){
                            if(sortOrders[j].order === order){
                                sortOrders[j].token = res[i].data.nextPageToken;
                                break;
                            }
                        }

                        //get all items from response
                        var items = res[i].data.items;

                        //loop through all items in response
                        for(var j = 0; j < items.length; j++){

                            //check if already exists in main array or temp nonDuplicates array
                            if($scope.searchResults.filter(function(d){
                                if(d.videoId == items[j].id.videoId){
                                    return d;
                                }
                                }).length === 0 && nonDuplicates.filter(function(d){
                                    if(d.id.videoId === items[j].id.videoId){
                                        return d;
                                    }
                                }).length === 0){
                                nonDuplicates.push(items[j]);
                            }
                        }
                    }

                    //if all the resulst were duplicates of already existing items in searchResults array, then finish
                    if(nonDuplicates.length === 0){
                        stopSearch('Finished search', 'info');
                        return;
                    }

                    //query the statistics for each video
                    var promises = [];
                    for(var i = 0; i < nonDuplicates.length; i++){
                        var count = 0;
                        var idList = [];
                        while(count < 50 && i < nonDuplicates.length){
                            idList.push(nonDuplicates[i].id.videoId);
                            i++;
                            count++;
                        }
                        promises.push($http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id='+ idList.toString() +'&key=' + apikey));
                    }

                    //wait for reequest to finish
                    $q.all(promises).then(function(res){

                        var data = [];
                        for(var i = 0; i < res.length; i++){
                            data = data.concat(res[i].data.items);
                        }

                        //for each video, add to the list
                        for(var i = 0; i < data.length; i++){
                            var datastats = data[i];
                            if(datastats){
                                var title = datastats.snippet.title;
                                var created = new Date(datastats.snippet.publishedAt);
                                var id = datastats.id;

                                //format the pct likes
                                var pctLikes;
                                if(datastats.statistics.likeCount){
                                    pctLikes = (Number(datastats.statistics.likeCount) / (Number(datastats.statistics.likeCount) + Number(datastats.statistics.dislikeCount))) * 100
                                }
                                else if(datastats.statistics.dislikeCount){
                                    pctLikes = 0;
                                }
                                else{
                                    pctLikes = undefined;
                                }

                                var viewCount = datastats.statistics.viewCount;
                                var likes = datastats.statistics.likeCount;
                                var dislikes = datastats.statistics.dislikeCount;

                                //extract duration from ISO 8601 (PT#H#M#S)
                                var duration = {};
                                if(datastats.contentDetails){
                                    duration = TimeService.isoToDuration(datastats.contentDetails.duration);
                                }

                                //add object to search results
                                $scope.searchResults.push({
                                    "title" : title,
                                    "created" : created,
                                    "videoId" : id,
                                    "pctLikes" : pctLikes || 0,
                                    "viewCount" : Number(viewCount),
                                    "likes" : Number(likes) || 0,
                                    "dislikes" : Number(dislikes) || 0,
                                    "thumbnail" : datastats.snippet.thumbnails.medium,
                                    "duration" : duration.formatted || null,
                                    "durationMinutes" : duration.approxMinutes || null
                                });
                            }
                        }

                        $scope.sort();

                        if(sortOrders.filter(function(d){
                                if(d.token){
                                    return d;
                                }
                            }).length === 0){
                            stopSearch('Search finished', 'info');
                            return;
                        }

                        fetchResults();
                    }, function(err){
                        stopSearch('Service unavailable', 'error');
                    })

                }, function(err){
                    stopSearch('Service unavailable', 'error');
                });
            };

            init();

        }]);
})();

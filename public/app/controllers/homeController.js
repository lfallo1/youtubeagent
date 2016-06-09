/**
 * HomeCtrl.js - Primvary controller. Handles the loading of videos, sorting and filtering.
 */
(function(){
    angular.module('youtubeSearchApp').controller('HomeCtrl', [
        '$rootScope', '$scope', '$http', '$q', '$log', '$timeout', '$location', 'TimeService', 'toaster', '$window', '$uibModal', 'AuthService', 'PlaylistService', '$sce', 'CountriesService',
        function($rootScope, $scope, $http, $q, $log, $timeout, $location, TimeService, toaster, $window, $modal, AuthService, PlaylistService, $sce, CountriesService){

            /**
             * set playlistService scope variable so the view can access service methods directly instead of creating redundant
             * intermediary methods
             * @type {PlaylistService|*}
             */
            $scope.playlistService = PlaylistService;

            var apikey = $rootScope.apiKey;
            var sortOrders = [];
            $scope.TEXT_SEARCH = 1;
            $scope.POPULAR_SEARCH = 2;

            /**
             * SortOption object
             * @param value
             * @param direction
             * @param glyph
             * @param displayName
             * @constructor
             */
            function SortOption(value, direction, glyph, displayName){
                this.value = value;
                this.direction = direction;
                this.glyph = glyph;
                this.displayName = displayName;
            };

            /**
             * setup view
             */
            var init = function(){
                CountriesService.getCountries().then(function(countries){
                    $scope.countries = countries;
                    $scope.selectedCountry = $scope.countries.filter(function(d){
                        if(d['alpha-2'] === 'US'){
                            return d;
                        }
                    })[0];
                    $scope.updateCategories();
                });

                $scope.searchMode = $scope.TEXT_SEARCH;
                $scope.totalResults = 0;
                $scope.searchParam = '';
                $scope.searchResults = $scope.filteredResults = [];

                //setup sort options (each sort option will be used for a search). different sort options
                //are used to increate search results
                $scope.sortOptions = [
                    new SortOption('viewCount', -1, 'user', 'Views'),
                    new SortOption('likes', -1, 'thumbs-up', 'Likes'),
                    new SortOption('dislikes', 1, 'thumbs-down', 'Dislikes'),
                    new SortOption('pctLikes', -1, 'star', 'Rating')
                ];
                $scope.sortField = $scope.sortOptions[0].value;
            };

            $scope.setPlaying = function(video, val){
              video.playing = val;
            };

            $scope.getIFrameSrc = function (videoId) {
                return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videoId);
            };

            $scope.sortOptionChanged = function(option){
                $scope.sortField = option.value;
                $scope.sort();
            };

            /**
             * Interrupt a search
             */
            $scope.interrupt = function(){
                $scope.wasInterrupted = true;
                $scope.fetching = false;
                toaster.pop('info', '', 'Search stopped');
            };

            /**
             * Handle a finished search
             * @param msg
             * @param toasterType
             */
            var stopSearch = function(msg, toasterType){
                $scope.fetching = false;
                toaster.pop(toasterType, '', msg);
            };

            /**
             * reset sort order objects (main purpose of this is to reset the tokens)
             */
            var resetSortOrders = function(){
                sortOrders = [
                    {order : 'relevance', token : ''},
                    {order : 'rating', token : ''},
                    {order : 'date', token : ''},
                    {order : 'viewCount', token : ''},
                    {order : 'title', token : ''}
                ];
            };

            /**
             * perform a new search
             */
            $scope.doSearch = function(){

                //if already searching, just return immediately
                if($scope.fetching){
                    return;
                }

                //if a search term exists
                $scope.searchParam = $scope.searchParam.trim();
                if($scope.searchParam){

                    resetSortOrders();
                    $scope.searchResults = [];

                    $scope.wasInterrupted = undefined;
                    $scope.fetching = true;

                    //call the wrapper
                    fetchResultsWrapper(0);
                }
            };

            /**
             * method that accepts an iteration number, and whether or not to cancel the search.
             * The method calls fetch results, then waits for all requests to finish.
             * If the yearlySearch is on, it will perform 5 additional searches between date spans to help improve results
             * @param iteration
             * @param cancel
             */
            var fetchResultsWrapper = function(iteration, cancel){

                //if cancel passed in (used if errors occur, and we want to the search to end
                if(cancel){
                    return;
                }

                //create date object query params if not the first pass
                var date = new Date();
                var dateLarge = '';
                var dateSmall = '';
                if(iteration !== 0){
                    //define the date range
                    var large = new Date(date.getFullYear()-iteration*2, date.getMonth(), date.getDate());
                    var small = new Date(date.getFullYear()-iteration - 2, date.getMonth(), date.getDate());
                    dateSmall = "&publishedAfter=" + small.toISOString();
                    dateLarge = "&publishedBefore=" + large.toISOString();
                }

                //increment iteration by two
                iteration += 2;

                //fetch results, passing the date range (the date ranges can be empty)
                fetchResults(dateSmall, dateLarge).then(function(){

                    //check if yearlySearch and iteration is not 10 or greater
                   if($scope.yearlySearch && iteration < 10){

                       //if we are searching again, reset the sort order objects & their tokens, then call fetchResultsWrapper
                       resetSortOrders();
                       fetchResultsWrapper(iteration);
                       return;
                   }
                    stopSearch('Finished search', 'info');
                }, function(err){

                    //if explicitly returning an error, then return
                    if(err){
                        return;
                    }

                    //otherwise, we want to try and continue
                    if($scope.yearlySearch && iteration < 10){
                        resetSortOrders();
                        fetchResultsWrapper(iteration);
                        return;
                    }
                });
            };

            /**
             * fetches the actual results
             * @param dateSmall (can be an empty string)
             * @param dateLarge (can be an empty string)
             * @param promise (optional)
             * @returns {*}
             */
            var fetchResults = function(dateSmall, dateLarge, promise){

                var deferred = promise || $q.defer();

                if($scope.wasInterrupted){
                    deferred.reject(true);
                    return;
                }

                var promises = [];

                //for each sort order type, execute the GET request.  doing this so that more results are returned.
                for (var i = 0; i < sortOrders.length; i++) {
                    var token = sortOrders[i].token ? 'pageToken=' + sortOrders[i].token + '&' : '';
                    promises.push($http.get("https://www.googleapis.com/youtube/v3/search?" + token + "key=" + apikey + "&part=snippet&q="                      + $scope.searchParam + "&type=video&maxResults=50" +
                        dateSmall + dateLarge +
                        "&order=" + sortOrders[i].order));
                }

                //wait for all requests to complete
                $q.all(promises).then(function (res) {

                    //no results, then finish
                    if (!res || res.length === 0) {
                        deferred.resolve();
                        return;
                    }

                    //no items in any results, then finish
                    var sum = 0;
                    res.forEach(function (d) {
                        if (d.data && d.data.items) {
                            sum += d.data.items.length;
                        }
                    });
                    if (sum === 0) {
                        deferred.resolve();
                        return;
                    }

                    //otherwise there are items
                    var nonDuplicates = [];
                    for (var i = 0; i < res.length; i++) {

                        //set next page tokens
                        var order = res[i].config.url.substring(res[i].config.url.lastIndexOf("=") + 1);
                        for (var j = 0; j < sortOrders.length; j++) {
                            if (sortOrders[j].order === order) {
                                sortOrders[j].token = res[i].data.nextPageToken;
                                break;
                            }
                        }

                        //get all items from response
                        var items = res[i].data.items;

                        //loop through all items in response
                        for (var j = 0; j < items.length; j++) {

                            //check if already exists in main array or temp nonDuplicates array
                            if ($scope.searchResults.filter(function (d) {
                                    if (d.videoId == items[j].id.videoId) {
                                        return d;
                                    }
                                }).length === 0 && nonDuplicates.filter(function (d) {
                                    if (d.id.videoId === items[j].id.videoId) {
                                        return d;
                                    }
                                }).length === 0) {
                                nonDuplicates.push(items[j]);
                            }
                        }
                    }

                    //query the statistics for each video
                    var promises = [];
                    for (var i = 0; i < nonDuplicates.length; i++) {

                        //create list of video id's (max list size of 50).
                        var count = 0;
                        var idList = [];
                        while (count < 50 && i < nonDuplicates.length) {
                            idList.push(nonDuplicates[i].id.videoId);
                            i++;
                            count++;
                        }

                        //create a promise with list of video id's for the batch request
                        promises.push($http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=' + idList.toString() + '&key=' + apikey));
                    }

                    if(promises.length === 0){
                        fetchResults(dateSmall, dateLarge, deferred);
                        return;
                    }

                    //wait for reequest to finish
                    $q.all(promises).then(function (res) {

                        var data = [];
                        for (var i = 0; i < res.length; i++) {
                            data = data.concat(res[i].data.items);
                        }

                        addVideosToList(data);

                        $scope.sort();

                        fetchResults(dateSmall, dateLarge, deferred);
                    }, function (err) {
                        deferred.reject();
                        stopSearch('Service unavailable', 'error');
                    })

                }, function (err) {
                    deferred.reject();
                    stopSearch('Service unavailable', 'error');
                });

                return deferred.promise;
            };

            $scope.updateCategories = function(){
                var url = 'https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode='+ $scope.selectedCountry['alpha-2'] +'&key=' + apikey;
                $http.get(url).then(function(res){
                    $scope.videoCategories = res.data.items.filter(function(d){
                        if(d.snippet.assignable){
                            return d;
                        }
                    });
                    $scope.videoCategories.push({'id' : '-1', 'snippet' : {'title' : 'Search All Categories'}});
                    $scope.selectedCategory = $scope.videoCategories[0];
                });
            };

            $scope.searchPopular = function(){
                $scope.searchResults = [];
                $scope.wasInterrupted = undefined;
                $scope.fetching = true;
                if($scope.selectedCategory && $scope.selectedCategory.id && $scope.selectedCategory.id > 0){
                    $scope.fetchPopularByCountryAndCategory($scope.selectedCountry['alpha-2'], $scope.selectedCategory.id);
                }
                else{
                    $scope.fetchPopularByCountryAll($scope.selectedCountry['alpha-2']);
                }
            };

            /**
             * get popular by country (loop through each assignable category))
             * @param countryAlphaCode
             * @param token
             */
            $scope.fetchPopularByCountryAll = function(countryAlphaCode, token){

                if($scope.wasInterrupted){
                    return;
                }

                token = token ? '&pageToken=' + token : '';

                var promises = [];
                promises.push($http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&maxResults=50&chart=mostPopular&regionCode=' + countryAlphaCode + token + '&key=' + apikey));
                for(var i = 0; i < $scope.videoCategories.length - 1; i++){
                    var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&maxResults=50&chart=mostPopular&regionCode=' + countryAlphaCode + '&videoCategoryId=' + $scope.videoCategories[i].id + token + '&key=' + apikey;
                    promises.push($http.get(url));
                }

                //wait for all requests to complete
                $q.all(promises).then(function (res) {

                    //no results, then finish
                    if (!res || res.length === 0) {
                        stopSearch('Finished', 'info');
                        return;
                    }

                    //no items in any results, then finish
                    var sum = 0;
                    res.forEach(function (d) {
                        if (d.data && d.data.items) {
                            sum += d.data.items.length;
                        }
                    });
                    if (sum === 0) {
                        stopSearch('Finished', 'info');
                        return;
                    }

                    //set next page tokens
                    var nextPageToken = res[0].data.nextPageToken;

                    //otherwise there are items
                    var nonDuplicates = [];
                    for (var i = 0; i < res.length; i++) {

                        //get all items from response
                        var items = res[i].data.items;

                        //loop through all items in response
                        for (var j = 0; j < items.length; j++) {

                            //check if already exists in main array or temp nonDuplicates array
                            if ($scope.searchResults.filter(function (d) {
                                    if (d.videoId == items[j].id) {
                                        return d;
                                    }
                                }).length === 0 && nonDuplicates.filter(function (d) {
                                    if (d.id === items[j].id) {
                                        return d;
                                    }
                                }).length === 0) {
                                nonDuplicates.push(items[j]);
                            }
                        }
                    }

                    //query the statistics for each video
                    var promises = [];
                    for (var i = 0; i < nonDuplicates.length; i++) {

                        //create list of video id's (max list size of 50).
                        var count = 0;
                        var idList = [];
                        while (count < 50 && i < nonDuplicates.length) {
                            idList.push(nonDuplicates[i].id);
                            i++;
                            count++;
                        }

                        //create a promise with list of video id's for the batch request
                        promises.push($http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=' + idList.toString() + '&key=' + apikey));
                    }

                    if(promises.length === 0){
                        stopSearch('Finished search', 'info');
                        return;
                    }

                    //wait for reequest to finish
                    $q.all(promises).then(function (res) {

                        var data = [];
                        for (var i = 0; i < res.length; i++) {
                            data = data.concat(res[i].data.items);
                        }

                        addVideosToList(data);

                        $scope.sort();

                        $scope.fetchPopularByCountryAll(countryAlphaCode, nextPageToken);
                    }, function (err) {
                        stopSearch('Service unavailable', 'error');
                    });
                });
            };

            /**
             * get most popular by category (and country - required for now)
             * @param countryAlphaCode
             * @param category
             * @param token
             */
            $scope.fetchPopularByCountryAndCategory = function(countryAlphaCode, category, token){

                if($scope.wasInterrupted){
                    return;
                }

                token = token ? '&pageToken=' + token : '';
                category = category || '';

                var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&maxResults=50&chart=mostPopular&regionCode=' + countryAlphaCode + '&videoCategoryId=' + category + token + '&key=' + apikey;
                $http.get(url).then(function(res){
                    var nextPageToken = res.data.nextPageToken;

                    if(res.data.items.length > 0){

                        var nonDuplicates = [];
                        //get all items from response
                        var items = res.data.items;

                        //loop through all items in response
                        for (var j = 0; j < items.length; j++) {

                            //check if already exists in main array or temp nonDuplicates array
                            if ($scope.searchResults.filter(function (d) {
                                    if (d.videoId == items[j].id) {
                                        return d;
                                    }
                                }).length === 0 && nonDuplicates.filter(function (d) {
                                    if (d.id === items[j].id) {
                                        return d;
                                    }
                                }).length === 0) {
                                nonDuplicates.push(items[j]);
                            }
                        }

                        //query the statistics for each video
                        var promises = [];
                        for (var i = 0; i < nonDuplicates.length; i++) {

                            //create list of video id's (max list size of 50).
                            var count = 0;
                            var idList = [];
                            while (count < 50 && i < nonDuplicates.length) {
                                idList.push(nonDuplicates[i].id);
                                i++;
                                count++;
                            }

                            //create a promise with list of video id's for the batch request
                            promises.push($http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=' + idList.toString() + '&key=' + apikey));
                        }

                        if(promises.length === 0){
                            stopSearch('Finished search', 'info');
                            return;
                        }

                        //wait for reequest to finish
                        $q.all(promises).then(function (res) {

                            var data = [];
                            for (var i = 0; i < res.length; i++) {
                                data = data.concat(res[i].data.items);
                            }

                            addVideosToList(data);

                            $scope.sort();

                            $scope.fetchPopularByCountryAndCategory(countryAlphaCode, category, nextPageToken);
                        }, function (err) {
                            stopSearch('Service unavailable', 'error');
                        });
                    }
                    else{
                        stopSearch('Finished search', 'info');
                    }
                });
            };

            var addVideosToList = function(data){
                //for each video, add to the list
                for (var i = 0; i < data.length; i++) {
                    var datastats = data[i];
                    if (datastats) {
                        var title = datastats.snippet.title;
                        var channelTitle = datastats.snippet.channelTitle;
                        var channelId = datastats.snippet.channelId;
                        var created = new Date(datastats.snippet.publishedAt);
                        var id = datastats.id;

                        //format the pct likes
                        var pctLikes;
                        if (datastats.statistics.likeCount) {
                            pctLikes = (Number(datastats.statistics.likeCount) / (Number(datastats.statistics.likeCount) + Number(datastats.statistics.dislikeCount))) * 100
                        }
                        else if (datastats.statistics.dislikeCount) {
                            pctLikes = 0;
                        }
                        else {
                            pctLikes = undefined;
                        }

                        var viewCount = datastats.statistics.viewCount;
                        var likes = datastats.statistics.likeCount;
                        var dislikes = datastats.statistics.dislikeCount;

                        //extract duration from ISO 8601 (PT#H#M#S)
                        var duration = {};
                        if (datastats.contentDetails) {
                            duration = TimeService.isoToDuration(datastats.contentDetails.duration);
                        }

                        //add object to search results
                        $scope.searchResults.push({
                            "title": title,
                            "channelTitle": channelTitle,
                            "channelId": channelId,
                            "created": created,
                            "videoId": id,
                            "pctLikes": pctLikes || 0,
                            "viewCount": Number(viewCount),
                            "likes": Number(likes) || 0,
                            "dislikes": Number(dislikes) || 0,
                            "thumbnail": datastats.snippet.thumbnails.medium,
                            "duration": duration.formatted || null,
                            "durationMinutes": duration.approxMinutes || null
                        });
                    }
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
                if(!$scope.minViews && (!$scope.minDislikes && $scope.minDislikes !== 0) && !$scope.minDate && !$scope.shorterThanFilter && !$scope.longerThanFilter && !$scope.minRating){
                    $scope.filteredResults = $scope.searchResults;
                    return;
                }
                $scope.filteredResults = $scope.searchResults.filter(function(d){
                    if(((!$scope.minDislikes && $scope.minDislikes !== 0) || d.dislikes <= $scope.minDislikes) &&
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

            init();

        }]);
})();

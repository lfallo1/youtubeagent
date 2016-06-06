var express = require('express');
var router = express.Router();
//var Youtube = require('../services/youtubeService.js');

router.get('/list', function (req, res, next) {
    //Youtube.fetchlist(function(err, results) {
    //    if (err) res.json(err);
    //    res.json(results);
    //})
});

router.get('/videos', function(req, res, next) {
    //Youtube.fetchVideos(req.params.id, function (err, results) {
    //    if (err) {
    //        res.send(err);
    //    }
    //    res.json(results);
    //})
});

module.exports = router;
var express = require('express');
var router = express.Router();
var fs = require('fs');

var results;

fs.readFile(__dirname + '/json/users.json','utf8', function(err, data){
    if(err){
        throw err;
    } else {
        results = JSON.parse(data);
    }
});

router.get('/api/users', function(req, res, next) {
    res.json(results);
});

module.exports = router;

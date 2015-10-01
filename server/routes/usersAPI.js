var fs = require('fs');
var path = require('path');

var results = {};
fs.readFile(path.join(__dirname, '../json/users.json'), 'utf8', function (err, data) {
    if (err) {
        throw err;
    } else {
        results = JSON.parse(data);
    }
});

module.exports.getAll = function (req, res, next) {
    res.json(results);
};

module.exports.getByName = function(req,res, next){
    var user = {};

    for(var i = 0; i < results.length; i++){
        if(results[i].name === req.params.name){
            user = results[i];
            break;
        }
    }

    res.json(user);
};

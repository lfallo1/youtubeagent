var fs = require('fs');
var path = require('path');

var results = {};
fs.readFile(path.join(__dirname, '../json/countries.json'), 'utf8', function (err, data) {
    if (err) {
        throw err;
    } else {
        results = JSON.parse(data);
    }
});

module.exports.getAll = function (req, res, next) {
    res.json(results);
};

module.exports.getById = function(req,res, next){
    var country = {};

    //find the country

    res.json(country);
};


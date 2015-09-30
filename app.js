var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');

var PORT = process.env.PORT || 3000;

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.set('view options', {
 layout: false
});

//Set middleware
app.use('/bower', express.static(__dirname + '/public/vendor/'));
app.use('/static', express.static(__dirname + '/public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
    res.render('layout/index');
});

app.get('/home', function(req, res){
   res.render('home');
});

app.get('/users', function(req, res){
 res.render('users');
});

var results = {};
fs.readFile(path.join(__dirname, '/server/json/users.json'), 'utf8', function (err, data) {
 if (err) {
  throw err;
 } else {
  results = JSON.parse(data);
 }
});

app.get('/api/users', function (req, res, next) {
 res.json(results);
});

app.get('*', function(req, res){
 console.log('FALLBACK!!');
 res.render('layout/index');
});

//Start server
app.listen(PORT);

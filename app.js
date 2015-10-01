var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path');

var app = express();

// Configuration

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.set('view options', {
 layout: false
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/bower', express.static(__dirname + '/public/vendor/'));
app.use('/static', express.static(__dirname + '/public/'));

// Routes

app.get('/', function(req, res){
 res.render('index');
});

app.get('/partials/:name', function(req, res){
 var name = req.params.name;
 res.render('partials/' + name);
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

// redirect all others to the index (HTML5 history)
app.get('*', function(req, res){
 res.render('index')
});

// Start server

app.listen(3000, function(){
 console.log("Express server listening");
});

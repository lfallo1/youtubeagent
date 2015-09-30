var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var users = require('./public/api/usersAPI.js');

var PORT = process.env.PORT || 3000;

//Set middleware
app.use('/bower', express.static(__dirname + '/node_modules/'));
app.use('/static', express.static(__dirname + '/public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//API Endpoints
app.get('/api/users', users);

//Set page routes
app.get('/', function(req, res) {
   res.sendfile('./views/layout/index.html');
});

app.get('/home', function(req, res){
   res.sendfile('./views/home.html');
});

app.get('/users', function(req, res){
   res.sendfile('./views/users.html');
});

//Start server
app.listen(PORT);

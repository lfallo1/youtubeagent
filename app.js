var express = require('express'),
    bodyParser = require('body-parser'),
    usersAPI = require('./server/routes/usersAPI.js');

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

//API
app.get('/api/users', usersAPI.getAll);
app.get('/api/users/:name', usersAPI.getByName);

// redirect all others to the index (HTML5 history)
app.get('*', function(req, res){
 res.render('index')
});

// Start server

app.listen(3000, function(){
 console.log("Express server listening");
});

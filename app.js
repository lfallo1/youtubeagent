var express = require('express'),
    bodyParser = require('body-parser');

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

// redirect all others to the index (HTML5 history)
app.get('*', function(req, res){
 res.render('index')
});

// Start server

app.listen(3000, function(){
 console.log("Express server listening");
});

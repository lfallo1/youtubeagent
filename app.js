var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var PORT = process.env.PORT || 3000;

app.use('static/', express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('*', function(req, res) {
   res.sendfile('./public/layout/index.html');
});

app.listen(PORT);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
 
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.htm');
	console.log('get /');
});
 
app.get('/payload', function(req, res) {
    res.sendStatus(200);
	console.log('get /payload');

});
 
app.post('/payload', function(req, res) {
      res.sendStatus(200);
	console.log('got a payload');
	console.log(req.body);
	res.end();

	//look into clientprocess to do commands
	//look into git npm module git 
});
 
app.listen(5000, function(){
	console.log('listening on port 5000')
});
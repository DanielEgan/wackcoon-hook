var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.htm');
	console.log('get /');
});

app.get('/payload', function (req, res) {
    res.sendStatus(200);
	console.log('get /payload');
});

app.post('/payload', function (req, res) {
	//verify that the payload is a push from the correct repo
	//verify repository.name == 'wackcoon-device' or repository.full_name = 'DanielEgan/wackcoon-device'
	console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
	console.log('pulling code from GitHub...');
	exec('git -C ~/projects/wackcoon-device pull -f', function(err, stdout, stderr) {
		if (stdout) console.log(stdout);
		if (stderr) console.log(stderr);
		console.log('done pull');
	});

	exec('npm -C ~/projects/wackcoon-device install', function(err, stdout, stderr) {
		if (stdout) console.log(stdout);
		if (stderr) console.log(stderr);
		console.log('done npm install');
	});
	res.sendStatus(200);
	res.end();
});

app.listen(5000, function () {
	console.log('listening on port 5000')
});
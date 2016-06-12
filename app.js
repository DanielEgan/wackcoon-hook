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
	var gitUrl = req.body.repository.git_url;
	console.log(gitUrl);
	//change into project directory
	exec('git -C ~/projects/wackcoon-device pull', function(err, stdout, stderr) {
		if (stdout) console.log(stdout);
		if (stderr) console.log(stderr);
	});
	//git pull

	// exec('command', function (err, stdout, stderr) {
	// 	if (stdout) console.log(stdout);
	// 	if (stderr) console.log(stderr);
	// 	if (!err) deferred.resolve();
	// 	else deferred.reject(err);
	// });
	res.sendStatus(200);
	// console.log('got a payload');
	// console.log(req.body);
	res.end();

	//look into clientprocess to do commands
	//look into git npm module git 
});

app.listen(5000, function () {
	console.log('listening on port 5000')

});
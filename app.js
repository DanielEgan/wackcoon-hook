var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var execSync = require('child_process').execSync;
var localtunnel = require('localtunnel');

var port = 5000;
var projectRoot = '~/projects/wackcoon-device';

var tunnel = localtunnel(port, { subdomain: 'wackcoonhook' }, function (err, tunnel) {
    if (err) console.log('error: ' + err);
    else app.listen(port, function () {
		console.log(`listening on port ${port}`)
	});
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//navigating to root should give user info about this hook
app.get('/', function (req, res) {
	res.send(`deploy service ready at ${tunnel.url}`);
	res.end();
});

//navigating to /deploy should initiate the deployment
app.get('/deploy', function (req, res) {
    deploy();
	res.send('deployment triggered');
	res.end();
});

//this is the primary route used by a GitHub hook
app.post('/deploy', function (req, res) {
	console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
	console.log('deploying...');
	deploy();
	res.sendStatus(200);
	res.end();
});

function deploy() {

	// reset any changes that have been made locally
	console.log('resetting...');
	execSync(`git -C ${projectRoot} reset --hard`, execCallback);

	// and ditch any files that have been added locally too
	console.log('cleaning...');
	execSync(`git -C ${projectRoot} clean -df`, execCallback);

	// now pull down the latest
	console.log('pulling...');
	execSync(`git -C ${projectRoot} pull -f`, execCallback);

	// and npm install with --production
	console.log('npm installing...');
	execSync(`npm -C ${projectRoot} install --production`, execCallback);

}

function execCallback(err, stdout, stderr) {
	if (stdout) console.log(stdout);
	if (stderr) console.log(stderr);
}

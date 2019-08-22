const express = require('express');
const app = express();
const path = require('path');

function exec(cmd, handler = function (error, stdout, stderr) { console.log(stdout); if (error !== null) { console.log(stderr) } }) {
	const childfork = require('child_process');
	return childfork.exec(cmd, handler);
}

app.use('/public', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});

app.get('/instructions', (req, res) => {
	res.sendFile(path.join(__dirname, 'assets', 'instructions.html'));
});

app.get('/about', (req, res) => {
	res.sendFile(path.join(__dirname, 'assets', 'about.html'));
});

exec('browserify assets/game.js -o assets/bundle.js');

app.listen(process.env.PORT || 3000, () => {
	console.log('Up and running');
});

console.log('Running at http://localhost:3000');

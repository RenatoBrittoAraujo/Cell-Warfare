const express = require('express');
const app = express();
const path = require('path');

app.use('/public', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});

app.listen(3000);
console.log('Running at http://localhost:3000');

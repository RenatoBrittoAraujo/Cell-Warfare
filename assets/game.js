let GameMap = require('./gamemap');
let Point = require('./point');

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

let map;

window.addEventListener('mousedown', (e) => {
	map.hexagonClick(new Point(e.x, e.y));
});

let playingGame = false;

let mapWidth = 1;
let mapHeight = 1;
window.addEventListener('keypress', manageMapSettingInput);

(function mainGameLoop()
{
	const initialVerticalOffset = 35
	map = new GameMap();
	setMap();
	
	setInterval(
		function() {
			
			clearCanvas();
			map.draw(context);
			
	}, 10);

})();

/*
Clear canvas back to css background-color
*/
function clearCanvas() {
	context.clearRect(0, 0, innerWidth, innerHeight);
}

/*
Manages user input during map selecting phase
*/
function manageMapSettingInput(e) {
	if (playingGame) {
		return;
	}
	switch (e.key) {
		case 'a':
			mapWidth = Math.max(mapWidth - 1, 1);
			break;
		case 'w':
			mapHeight = Math.max(mapHeight - 1, 1);
			break;
		case 's':
			mapHeight++;
			break;
		case 'd':
			mapWidth++;
			break;
		case 'Enter':
			playingGame = true;
			startGame();
			break;
	}
	setMap();
}

function setMap() {
	map.fillMap(mapWidth, mapHeight);
	map.setPosition(new Point(
		canvas.width / 2 - map.getWidth() / 2,
		canvas.height / 2 - map.getHeight() / 2 - 35
	));
}

function startGame() {
	
}
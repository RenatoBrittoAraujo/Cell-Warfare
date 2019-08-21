let Team = require('./team');
let GameMap = require('./gamemap');
let Point = require('./point');
let NPC = require('./npc');

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

let map;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playingGame = false;
let mapWidth = 1;
let mapHeight = 1;

let timeSinceLastTurn;
let turnLenght = 3000; // In milisseconds

let playerTeam = new Team();
let npcTeam = new Team();

(function mainGameLoop()
{
	map = new GameMap();
	setMap();
	
	/* Every ten milisseconds, the game updates */
	setInterval(
		function() {
			
			clearCanvas();
			map.draw(context);

			if (playingGame) {
				timeSinceLastTurn += 10; // Milisseconds
				if (timeSinceLastTurn > turnLenght) {
					timeSinceLastTurn = 0;
					console.log('PROCESSING TURN');
				}
			}

	}, 10);

})();

// LISTENERS

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

window.addEventListener('mousedown', (e) => {
	let rect = canvas.getBoundingClientRect();
	let hexagonFound = map.hexagonClick(new Point(e.x - rect.x, e.y - rect.y));
	if (hexagonFound) {
		
	}
});

window.addEventListener('keypress', (e) => {
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
			startGame();
			return;
	}
	setMap();
});

// FUNCTIONS

/*
Clear canvas back to css background-color
*/
function clearCanvas() {
	context.clearRect(0, 0, innerWidth, innerHeight);
}

/*
	Fills map with acoording input
*/
function setMap() {
	map.fillMap(mapWidth, mapHeight);
	map.setPosition(new Point(
		canvas.width / 2 - map.getWidth() / 2,
		canvas.height / 2 - map.getHeight() / 2 - 35
	));
}

/*
	Initilizes game
*/
function startGame() {
	map.uncolonize();
	timeSinceLastTurn = 0;
	playingGame = true;
}
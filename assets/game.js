let Team = require('./team');
let GameMap = require('./gamemap');
let Point = require('./point');
let NPC = require('./npc');

let moneyDisplay = document.getElementById('money');
let kamikaseButton = document.getElementById('kamikase');
let canvas = document.querySelector('canvas');
let newTurnDisplay = document.getElementById('newturn');
let context = canvas.getContext('2d');

let map;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playingGame = false;
let mapWidth = 1;
let mapHeight = 1;

let timeSinceLastTurn;
const minTurnLenght = 3000; // In milisseconds
const maxTurnLenght = 10000;
let newTurnLenght = 3000;
const kamikaseCooldown = 60000;
let timeSinceLastKamikase = 0;

let playerTeam = new Team();
let npcTeam = new Team();

let teamList = [playerTeam, npcTeam];

playerTeam.setGreen(255);
npcTeam.setRed(255);

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
				timeSinceLastKamikase += 10;
				updateKamikase();

				if (timeSinceLastTurn > newTurnLenght) {
					newTurnLenght = Math.floor(Math.random() * (maxTurnLenght - minTurnLenght) + minTurnLenght);
					timeSinceLastTurn = 0;
					for (team of teamList) {
						team.runTurn();
					}
					map.runTurn();
				}
				updateTurnDisplay();
				moneyDisplay.innerHTML = 'Money: ' + playerTeam.getMoney();
				for (team of teamList) {
					if (team.hasLost() && team == playerTeam) {
						playingGame = false;
						console.log('GAME OVER');
					}
				}
			}
	}, 10);

})();

// LISTENERS

kamikaseButton.addEventListener('mousedown', () => {
	if (playingGame) {
		map.kamikase();
		timeSinceLastKamikase = 0;
	}
});

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
			if (map.isValid()) {
				startGame();
			}
			return;
	}
	setMap();
});

// FUNCTIONS

/*
	Updates Kamikase Button
*/
function updateKamikase() {
	kamikaseButton.innerHTML = 'Kamikase (' + 
		(timeSinceLastKamikase > kamikaseCooldown ? 
			'<b>READY</b>' : 
		(Math.floor(timeSinceLastKamikase / 1000)) + '/' + (Math.floor(kamikaseCooldown / 1000))) +
		')';
}

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
	map.addTeam(playerTeam);
	map.addTeam(npcTeam);
	map.setPlayerTeam(playerTeam);
	newTurnDisplay.innerHTML = '<b> NEW TURN </b>';
}

/*
	Generates style inside new turn tag
*/
function updateTurnDisplay() {
	const stdR = 52;
	const stdG = 58;
	const stdB = 64;
	const displayTime = 3000;
	let displayPercentage = (displayTime - timeSinceLastTurn) / displayTime;
	displayPercentage = Math.min(1.0, Math.max(0.0, displayPercentage)); 
	newTurnDisplay.style = 'text-decoration: none; color: rgb(' +
	 	((255 - stdR) * displayPercentage + stdR) + ',' + 
		((255 - stdG) * displayPercentage + stdG) + ',' + 
		((255 - stdB) * displayPercentage + stdB) + ')';
}
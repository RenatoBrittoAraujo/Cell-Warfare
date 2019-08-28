/* FILE REQUIRES */

let Team = require('./team');
let GameMap = require('./gamemap');
let Point = require('./point');
let NPC = require('./npc');

/* HTML ELEMENTS */

let moneyDisplay = document.getElementById('money');
let kamikaseButton = document.getElementById('kamikase');
let canvas = document.querySelector('canvas');
let newTurnDisplay = document.getElementById('newturn');
let context = canvas.getContext('2d');

/* GAME TIME CONSTANTS */
// NOTE: In milisseconds

const refreshRate = 10;
const minTurnLenght = 3000;
const maxTurnLenght = 6000;
const kamikaseCooldown = 60000;
const npcMaxActionCooldown = 300;

/* GAME OBJECTS */

let map;
let playerTeam = new Team();
let npcTeam = new Team();

/* GAME VARIABLES */

let playingGame = false;
let mapWidth = 1;
let mapHeight = 1;

let timeSinceLastTurn;
let newTurnLenght = 3000;

let timeSinceLastNPCAction = 0;

/* GAME LISTS */

let teamList = [playerTeam, npcTeam];

/* SETTINGS */

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

playerTeam.setGreen(255);
npcTeam.setRed(255);

map = new GameMap();
map.setRefreshRate(refreshRate);
map.setKamikaseCooldown(kamikaseCooldown);

let npc = new NPC();

/* DEVELOPING ONLY */
npc.setDebuggingMode(true);

npc.setNpcRefreshRate(npcMaxActionCooldown);
npc.setTeam(npcTeam);
npc.setEnemies([playerTeam]);
npc.init();
npc.setGameMap(map);
setMap();

/* MAIN GAME LOOP */

(function () {
	let runTurn = () => {
		for (team of teamList) {
			team.runTurn();
		}
		map.runTurn();
	}

	setInterval(function () {

		clearCanvas();
		map.draw(context);

		if (playingGame) {

			map.refresh();

			timeSinceLastTurn += refreshRate;
			timeSinceLastNPCAction += refreshRate;

			if (timeSinceLastNPCAction >= npcMaxActionCooldown) {
				timeSinceLastNPCAction = 0;
				npc.takeAction();
			}

			if (timeSinceLastTurn >= newTurnLenght) {
				newTurnLenght = Math.floor(Math.random() * (maxTurnLenght - minTurnLenght) + minTurnLenght);
				timeSinceLastTurn = 0;
				runTurn();
			}

			updateKamikaseDisplay();
			updateMoneyDiplay();
			updateTurnDisplay();

			gameEndHandling();
		}

	}, refreshRate);

})();

/* LISTENERS */

kamikaseButton.addEventListener('mousedown', () => {
	if (playingGame) {
		map.kamikase();
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

/* GAME FUNCTIONS */

/* 
	Handles game's ending conditions
*/
function gameEndHandling() {
	let aliveTeams = 0;
	let foundTeam;
	for (team of teamList) {
		if (!team.hasLost())
		{
			aliveTeams++;
			foundTeam = team;
		}
	}
	if (aliveTeams == 0) {
		window.location.href = '/youvetied';
	} else if (playerTeam.hasLost()) {
		window.location.href = '/youvelost';
	} else if (aliveTeams == 1 && foundTeam == playerTeam) {
		window.location.href = '/youvewon';
	}
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
	Generates style inside turn HTML tag
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

/*
	Generates style inside money HTML tag
*/
function updateMoneyDiplay() {
	moneyDisplay.innerHTML = 'Money: ' + playerTeam.getMoney();
}

/*
	Generates style inside kamikase HTML tag
*/
function updateKamikaseDisplay() {
	kamikaseButton.innerHTML = map.getKamikaseHTML();
}
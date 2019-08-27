/* FILE REQUIRES */

let hexagonPackage = require('./hexagon')
let Point = require('./point')

function GameMap() {

	/* GAMEMAP CONSTANTS */

	const tileWidht = 100;
	const initialTileFortification = 3;

	/* GAMEMAP VARIABLES */

	let refreshRate;
	this.setRefreshRate = (val) => refreshRate = val;

	let timeSinceLastKamikase = 0;
	let kamikaseCooldown;
	this.setKamikaseCooldown = (val) => kamikaseCooldown = val;

	const uncolonizedHexColor = 'rgb(180, 180, 180)';

	let hexagonList = [];
	let position = new Point(0, 0);

	let mapWidth = 0;
	this.getWidth = () => mapWidth;
	let mapHeight = 0;
	this.getHeight = () => mapHeight;

	let hexWidth = 1;
	let hexHeight = 1;

	let playerTeam;
	this.setPlayerTeam = (team) => { playerTeam = team; }

	/* GAMEMAP FUNCTIONS */

	/* 
		Returns true if kamikase option is available
	*/
	this.kamikaseAvailable = () => timeSinceLastKamikase >= kamikaseCooldown;

	/*
		Performs Kamikase on map
	*/
	this.kamikase = () => {
		for (hexagon of hexagonList) {
			if (hexagon.hasTeam()) {
				hexagon.removeFortification();
			}
		}
		timeSinceLastKamikase = 0;
	}

	/* 
		Returns kamikase HTML tag 
	*/
	this.getKamikaseHTML = () => {
		return 'Kamikase (' +
			(timeSinceLastKamikase > kamikaseCooldown ?
				'<b>READY</b>' :
				(Math.floor(timeSinceLastKamikase / 1000)) + '/' + (Math.floor(kamikaseCooldown / 1000))) +
			')';
	}

	/*
		Adds a new team in the map (with it's capital)
	*/
	this.addTeam = function (team) {
		let index;
		do {
			index = Math.floor(Math.random() * hexagonList.length);
			if (index < 0 || index >= hexagonList.length) {
				console.log('INVALID HEXAGON INDEX');
			}
		} while (hexagonList[index].hasTeam());
		hexagonList[index].colonize(team, initialTileFortification);
		team.addHexagon();
	}

	/*
		Connects hexagons with it's neighbors
	*/
	this.constructNeighbors = () => {
		for (let i = 0; i < hexagonList.length; i++) {
			// TOP
			if (i - hexWidth >= 0) {
				hexagonList[i].addNeighbor(hexagonList[i - hexWidth]);
			}
			// BOTTOM
			if (i + hexWidth < hexagonList.length) {
				hexagonList[i].addNeighbor(hexagonList[i + hexWidth]);
			}
			// Line top - when hexagons are generated, some go top-rigth from last and others goes top-left
			// if the modulus of index is even, it's a top, else bottom
			if ((i % hexWidth) % 2 == 0) {
				// TOP-LEFT
				if (i % hexWidth != 0 && i - hexWidth - 1 >= 0) {
					hexagonList[i].addNeighbor(hexagonList[i - hexWidth - 1]);
				}
				// TOP-RIGHT
				if (i % hexWidth != hexWidth - 1 && i - hexWidth + 1 >= 0) {
					hexagonList[i].addNeighbor(hexagonList[i - hexWidth + 1]);
				}
				// BOTTOM-LEFT
				if (i % hexWidth != 0 && i - 1 >= 0) {
					hexagonList[i].addNeighbor(hexagonList[i - 1]);
				}
				// BOTTOM-RIGHT
				if (i % hexWidth != hexWidth - 1 && i + 1 < hexagonList.length) {
					hexagonList[i].addNeighbor(hexagonList[i + 1]);
				}
			} else {
				// TOP-LEFT
				if (i % hexWidth != 0 && i - 1 >= 0) {
					hexagonList[i].addNeighbor(hexagonList[i - 1]);
				}
				// TOP-RIGHT
				if (i % hexWidth != hexWidth - 1 && i + 1 < hexagonList.length) {
					hexagonList[i].addNeighbor(hexagonList[i + 1]);
				}
				// BOTTOM-LEFT
				if (i % hexWidth != 0 && i + hexWidth - 1 < hexagonList.length) {
					hexagonList[i].addNeighbor(hexagonList[i + hexWidth - 1]);
				}
				//	BOTTOM-RIGHT
				if (i % hexWidth != hexWidth - 1 && i + hexWidth + 1 < hexagonList.length) {
					hexagonList[i].addNeighbor(hexagonList[i + hexWidth + 1]);
				}
			}
		}
	}

	/*
		Fills map with hexagons following specified map width and height
	*/
	this.fillMap = function (width, height) {

		hexagonList = [];
		mapWidth = 0;
		mapHeight = 0;
		hexWidth = width;
		hexHeight = height;

		let makeLine = function (beginHex) {
			let goingBottom = true
			let lastHex = beginHex
			for (let i = 1; i < width; i++) {
				if (goingBottom) {
					lastHex = hexagonPackage.adjacentHexagon(lastHex, hexagonPackage.hexagonalDirection.BOTTOM_RIGHT);
				} else {
					lastHex = hexagonPackage.adjacentHexagon(lastHex, hexagonPackage.hexagonalDirection.TOP_RIGHT);
				}
				hexagonList.push(lastHex)
				goingBottom = !goingBottom;
			}
		}

		let baseHex = new hexagonPackage.Hexagon(position.getX(), position.getY(), tileWidht);
		hexagonList.push(baseHex);
		makeLine(baseHex);
		let lastHex = baseHex;

		for (let i = 1; i < height; i++) {
			let newHex = hexagonPackage.adjacentHexagon(lastHex, hexagonPackage.hexagonalDirection.BOTTOM);
			hexagonList.push(newHex);
			makeLine(newHex);
			lastHex = newHex;
		}

		for (hex of hexagonList) {
			mapWidth = Math.max(
				mapWidth,
				hex.getPosition().getX() + hex.getWidth() - position.getX()
			);
			mapHeight = Math.max(
				mapHeight,
				hex.getPosition().getY() + hex.getHeight() - position.getY()
			);
		}

		this.constructNeighbors();
	}

	/* 
		Draws map to canvas, canvas context as parameter
	*/
	this.draw = function (context) {
		for (hexagon of hexagonList) {
			hexagon.draw(context);
		}
	}

	/*
		Set's map position in relation to context
	*/
	this.setPosition = function (point) {
		let vectorFromLastPosition = new Point(
			point.getX() - position.getX(),
			point.getY() - position.getY()
		);
		position = point;
		for (hexagon of hexagonList) {
			let oldPosition = hexagon.getPosition();
			let newPosition = new Point();
			newPosition.setX(oldPosition.getX() + vectorFromLastPosition.getX());
			newPosition.setY(oldPosition.getY() + vectorFromLastPosition.getY());
			hexagon.setPosition(newPosition);
		}
	}

	/*
		Turns all hexagons to default uncolonized color and removes all teams
	*/
	this.uncolonize = function () {
		for (hexagon of hexagonList) {
			hexagon.setColor(uncolonizedHexColor);
			hexagon.setTeam(null);
		}
	}

	/*
		Returns true if map is valid for a game
	*/
	this.isValid = function () {
		return hexagonList.length > 1;
	}

	/*
		Performs the action of a player click on a hexagon
	*/
	this.hexagonClick = function (point) {
		for (hexagon of hexagonList) {
			if (hexagon.isPointInside(point)) {
				this.hexagonAction(hexagon, playerTeam);
			}
		}
	}

	/*
		Handles invoking of a game action upon a hexagon by a team
	*/
	this.hexagonAction = function (hexagon, team) {
		if (!team.hasMoney()) {
			return;
		}
		if (!hexagon.hasTeam()) {
			team.addHexagon();
			hexagon.colonize(team);
		} else if (hexagon.getTeam() === team) {
			if (hexagon.isAtCapFortification()) {
				return;
			}
			hexagon.addFortification();
		} else {
			if (team.canAttack(hexagon)) {
				team.attackedHexagon(hexagon);
				hexagon.removeFortification();
			} else {
				return;
			}
		}
		team.spendMoney();
	}

	/*
		Returns hexagons of a specified team or uncolonized hexagons if no parameter is passed
	*/
	this.getHexagons = (team = undefined) => {
		let teamHexagons = hexagonList.filter((hex) => {
			if (team == undefined) {
				return !hex.hasTeam();
			} else {
				return hex.getTeam() === team;
			}
		});
		return teamHexagons;
	}

	/*
		Returns uncolonized hexagons
	*/
	this.getUncolonizedHexagons = () => {
		return this.getHexagons();
	}

	/*
		Runs a game turn logic
	*/
	this.runTurn = () => {
		for (hexagon of hexagonList) {
			if (!hexagon.hasTeam()) {
				continue;
			}
			if (hexagon.overwelmed() > 0) {
				hexagon.removeFortification();
			}
		}
	}

	/*
	Runs logic of gamemap update
	*/
	this.refresh = () => {
		timeSinceLastKamikase += refreshRate;
	}

}

module.exports = GameMap;
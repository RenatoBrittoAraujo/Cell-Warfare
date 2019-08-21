let hexagonPackage = require('./hexagon')
let Point = require('./point')

const tileWidht = 100;
const initialTileFortification = 3;

function GameMap() {
	
	const uncolonizedHexColor = 'rgb(140, 140, 140)';

	let hexagonList = [];	
	let position = new Point(0, 0);
	let mapWidth = 0;
	let mapHeight = 0;
	let playerTeam;

	this.setPlayerTeam = (team) => { playerTeam = team; }

	this.addTeam = function(team) {
		let index;
		do {
			index = Math.floor(Math.random() * hexagonList.length); 
			if (index < 0 || index >= hexagonList.length) {
				console.log('INVALID HEXAGON INDEX');
			}
		} while(hexagonList[index].hasTeam());
		console.log(team.fortificationColor(initialTileFortification));
		hexagonList[index].setColor(team.fortificationColor(initialTileFortification));
	}
	
	this.fillMap = function(width, height) {

		hexagonList = [];
		mapWidth = 0;
		mapHeight = 0;

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
	}
	
	this.draw = function (context) {
		for (hexagon of hexagonList) {
			hexagon.draw(context);
		}
	}

	/*
		Set's map position in relation to context
	*/
	this.setPosition = function(point) {
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
	this.uncolonize = function() {
		for (hexagon of hexagonList) {
			hexagon.setColor(uncolonizedHexColor);
			hexagon.setTeam(null);
		}
	}

	this.isValid = function() {
		return hexagonList.length > 1;
	}

	this.getWidth = function() { return mapWidth; }
	this.getHeight = function() { return mapHeight; }

	this.hexagonClick = function(point) {
		for (hexagon of hexagonList) {
			if (hexagon.isPointInside(point)) {
				this.hexagonPress(hexagon, playerTeam);
			}
		}
	}

	this.hexagonPress = function(hexagon, team) {
		if (!hexagon.hasTeam()) {
			team.addHexagon();
			console.log('COLONIZED');
			hexagon.setTeam(team);
		} else if (hexagon.getTeam() === team) {
			hexagon.addFortification();
		} else {

		}
	}
}

module.exports = GameMap;
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
			if (map.isValid()) {
				startGame();
			}
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
	map.addTeam(playerTeam);
	map.addTeam(npcTeam);
}
},{"./gamemap":2,"./npc":4,"./point":5,"./team":6}],2:[function(require,module,exports){
let hexagonPackage = require('./hexagon')
let Point = require('./point')

const tileWidht = 100;

function GameMap() {
	
	const uncolonizedHexColor = 'rgb(140, 140, 140)';

	let hexagonList = [];	
	let position = new Point(0, 0);
	let mapWidth = 0;
	let mapHeight = 0;

	let teams = [];

	this.addTeam = function(team) {
		let index;
		do {
			index = Math.floor(Math.random() * hexagonList.length); 
			if (index < 0 || index >= hexagonList.length) {
				console.log('INVALID HEXAGON INDEX');
			}
		} while(hexagonList[index].hasTeam());
		team.setCapital(hexagonList[index]);
		hexagonList[index].setColor(team.capitalColor());
		teams.push(team);
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
				return hexagon;
			}
		}
	}

	this.hexagonPress = function(hexagon, team) {

	}
}

module.exports = GameMap;
},{"./hexagon":3,"./point":5}],3:[function(require,module,exports){
let Point = require('./point')

const hexagonalDirection = {
	TOP_LEFT: 0,
	TOP: 1,
	TOP_RIGHT: 2,
	BOTTOM_LEFT: 3,
	BOTTOM: 4,
	BOTTOM_RIGHT: 5
};

/*
	Returns a new intance of a regular hexagon object with horizontal total span of width
*/
function Hexagon(x, y, width) {

	let height = width * Math.sqrt(3.0) / 2.0;
	let edgeSize = width / 2.0;

	let points = [];
	
	let createPoints = function(x, y) {
		points = [
			new Point(x + edgeSize / 2.0, y),
			new Point(x + width - edgeSize / 2.0, y),
			new Point(x + width, y + height / 2.0),
			new Point(x + width - edgeSize / 2.0, y + height),
			new Point(x + edgeSize / 2.0, y + height),
			new Point(x, y + height / 2.0)
		];
	}

	createPoints(x, y);
	
	let color = 'rgb(0, 0, 0)';

	let team = null;

	this.setTeam = function(newTeam) {
		team = newTeam;
	}

	this.getTeam = function() {
		return team;
	}

	this.hasTeam = function() {
		return !(team === null);
	}
	
	this.draw = function(context) {
		context.beginPath();
		lastPoint = points[points.length - 1]
		context.moveTo(lastPoint.getX(), lastPoint.getY());
		for (point of points) {
			context.lineTo(point.getX(), point.getY());
		}
		context.fillStyle = color;
		context.fill();
	};

	this.setColor = function(newColor) {
		color = newColor;
	};

	this.setTeam = function(newTeam) {
		team = newTeam;
	}

	this.hasTeam = () => { return !!team; }

	this.getTeam = () => { return team; }
	this.getWidth = function() { return width; }
	this.getHeight = function() { return height; }
	this.getPosition = function() { return new Point(x, y); }
	this.getEdgeSize = function() { return edgeSize; }

	this.setPosition = function(point) { createPoints(point.getX(), point.getY()); }
	
	/*
		Returns true if a given point is inside hexagon, false otherwise	
	*/
	this.isPointInside = function(pointB) {

		/*
			Checks if point that is on the same line of a segment is inside given segment
		*/
		let isInsideSegment  = function(segA, segB, point) {
			let maxSX = Math.max(segA.getX(), segB.getX());
			let minSX = Math.min(segA.getX(), segB.getX());
			let maxSY = Math.max(segA.getY(), segB.getY());
			let minSY = Math.min(segA.getY(), segB.getY());
			let isBoundedByX = point.getX() <= maxSX && point.getX() >= minSX;
			let isBoundedByY = point.getY() <= maxSY && point.getY() >= minSY;
			return isBoundedByX && isBoundedByY;
		}

		/*
			Returns the cross product between a to c and b to c
		*/
		let crossProduct = function(a, b, c) {
			let newA = new Point(a.getX() - c.getX(), a.getY() - c.getY());
			let newB = new Point(b.getX() - c.getX(), b.getY() - c.getY());
			return newA.getX() * newB.getY() - newA.getY() * newB.getX();
		} 

		let crossProdSignal;

		for(let i = 0; i < points.length + 1; i++) {

			let pointA = points[i % points.length];
			let pointC = points[(i + 1) % points.length];
			let crossProdAns = crossProduct(pointA, pointB, pointC);

			if (crossProdAns === 0) {
				return isInsideSegment(pointA, pointC, pointB);
			} else if (i === 0) {
				crossProdSignal = crossProdAns / Math.abs(crossProdAns);
			} else if (crossProdSignal !== crossProdAns / Math.abs(crossProdAns)) {
				return false;
			}

		}
		return true;
	} 
}

// The following contant determines the standard distance between hexagons
const adjacentHexagonDistance = 2;

/*
	Returns a new Hexagon adjacent to input hexagon off to the cited direction
*/
function adjacentHexagon(hexagon, direction) {
	
	let newX = 0;
	let newY = 0;
	let newWidth = hexagon.getWidth();
	let oldPosition = hexagon.getPosition();
	const factorY = 2 / Math.sqrt(3) * adjacentHexagonDistance;
	const factorZ = factorY / 2;
	
	switch (direction) {
		case hexagonalDirection.TOP_RIGHT:
			newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + factorY + factorZ;
			newY = oldPosition.getY() - hexagon.getHeight() / 2 - adjacentHexagonDistance;
			break;
		case hexagonalDirection.TOP:	
			newX = oldPosition.getX();
			newY = oldPosition.getY() - nexagon.getHeight() - 2 * adjacentHexagonDistance;
			break;
		case hexagonalDirection.BOTTOM:	
			newX = oldPosition.getX();
			newY = oldPosition.getY() + hexagon.getHeight() + 2 * adjacentHexagonDistance;
			break;
		case hexagonalDirection.BOTTOM_RIGHT:	
			newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + factorY + factorZ;
			newY = oldPosition.getY() + hexagon.getHeight() / 2 + adjacentHexagonDistance;
			break;
	}
	return new Hexagon(newX, newY, newWidth);
}

module.exports = {
	Hexagon,
	adjacentHexagon,
	hexagonalDirection
}
},{"./point":5}],4:[function(require,module,exports){
let GameMap = require('./gamemap');
let Team = require('./team');

let NPC = function() {

}

module.exports = NPC;
},{"./gamemap":2,"./team":6}],5:[function(require,module,exports){
/*
	2D space point
*/
class Point {
	constructor(conX, conY) {
		let x = conX;
		let y = conY;
		this.setX = (newX) => { x = newX; };
		this.setY = (newY) => { y = newY; };
		this.getX = () => { return x; };
		this.getY = () => { return y; };
		this.print = () => { console.log('X: ' + Math.round(x * 100) / 100 + ' Y: ' + Math.round(y * 100) / 100); }
	}
}

module.exports = Point;

},{}],6:[function(require,module,exports){
const capitalColorDelta = 0.8;
const minFortification = 70;
const fortificationLevels = 10;

let Team = function() {
  
  let red = minFortification;
  let green = minFortification;
  let blue = minFortification;

  let hexagonList = [];
  let money = 0;

  let capital;

  this.setCapital = (hexagon) => { capital = hexagon; }
  this.getCapital = () => { return capital; }
  this.isCapital = (hexagon) => { return hexagon == capital; }

  this.setRed = (newRed) => { red = Math.floor(Math.max(Math.min(newRed, 255), minFortification)); }
  this.setGreen = (newGreen) => { green = Math.floor(Math.max(Math.min(newGreen, 255), minFortification)); }
  this.setBlue = (newBlue) => { blue = Math.floor(Math.max(Math.min(newBlue, 255), minFortification)); }

  this.addHexagons = (hexagon) => {
    hexagonList.push(hexagon);
  }
  this.runTurn = () => {
    money += hexagonList.length;
  }
  this.getMoney = () => { return money; }

  this.fortificationColor = function(level) {
    if (level < 1 || level > fortificationLevels) {
      console.log('INVALID FORTIFICATION LEVEL');
    }
    return 'rgb(' + 
      (Math.floor(Math.max(level * (red * capitalColorDelta - minFortification)) / fortificationLevels, 0) + minFortification) + ',' + 
      (Math.floor(Math.max(level * (green * capitalColorDelta - minFortification)) / fortificationLevels, 0) + minFortification) + ',' +
      (Math.floor(Math.max(level * (blue * capitalColorDelta - minFortification)) / fortificationLevels, 0) + minFortification) + ',' +
      ')';
  }

  this.capitalColor = function() {
    return 'rgb(' + red + ',' + green + ',' + blue + ')';
  }
}

module.exports = Team;
},{}]},{},[1]);

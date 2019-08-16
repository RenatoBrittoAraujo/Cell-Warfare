(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

(function mainGameLoop()
{
	let w = 1;
	let h = 1;
	map = new GameMap();
	map.fillMap(w, h);
	map.setPosition(new Point(canvas.width / 2 - 100 / 2, canvas.height / 2 - 100 / 2 - 35))

	window.addEventListener('keypress', (e) => {
		switch (e.key) {
			case 'a':
				w = Math.max(w - 1, 1);
				break;
			case 'w':
				h = Math.max(h - 1, 1);
				break;
			case 's':
				h++;
				break;
			case 'd':
				w++;
				break;
		}
		map.fillMap(w, h);
		map.setPosition(new Point(
			canvas.width / 2 - map.getWidth() / 2,
			canvas.height / 2 - map.getHeight() / 2 - 35
		));
	});
	
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
},{"./gamemap":2,"./point":4}],2:[function(require,module,exports){
let hexagonPackage = require('./hexagon')
let Point = require('./point')

const tileWidht = 100;

function GameMap() {
	
	let hexagonList = [];
	let position = new Point(0, 0);
	let mapWidth = 0;
	let mapHeight = 0;
	
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

	this.getWidth = function() { return mapWidth; }
	this.getHeight = function() { return mapHeight; }
}

module.exports = GameMap;
},{"./hexagon":3,"./point":4}],3:[function(require,module,exports){
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

	this.getWidth = function() { return width; }
	this.getHeight = function() { return height; }
	this.getPosition = function() { return new Point(x, y); }
	this.getEdgeSize = function() { return edgeSize; }

	this.setPosition = function(point) { createPoints(point.getX(), point.getY()); }

	/*
		Returns true if a given point is inside hexagon, false otherwise
	*/
	this.isPointInside = function(point) {
		for(let i = 0; i < points.length + 1; i++) {
			
		}
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
		case hexagonalDirection.TOP_LEFT:

		newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + adjacentHexagonDistance;
		newY = oldPosition.getY() + hexagon.getHeight() / 2 + adjacentHexagonDistance;
		break;
		case hexagonalDirection.TOP_RIGHT:

		newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + factorY + factorZ;
		newY = oldPosition.getY() - hexagon.getHeight() / 2 - adjacentHexagonDistance;
		break;
		case hexagonalDirection.TOP:
		
		newX = oldPosition.getX();
		newY = oldPosition.getY() - nexagon.getHeight() - 2 * adjacentHexagonDistance;
		break;
		case hexagonalDirection.BOTTOM_LEFT:
		
		newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + adjacentHexagonDistance;
			newY = oldPosition.getY() + hexagon.getHeight() / 2 + adjacentHexagonDistance;
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
},{"./point":4}],4:[function(require,module,exports){
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
	}
}

module.exports = Point;

},{}]},{},[1]);

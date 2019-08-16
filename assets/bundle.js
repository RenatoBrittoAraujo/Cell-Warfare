(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let GameMap = require('./gamemap')

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

(function mainGameLoop()
{
	map = new GameMap();
	map.fillMap(20, 20);
	
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

},{"./gamemap":2}],2:[function(require,module,exports){
let hexagonPackage = require('./hexagon')

function GameMap() {
	
	let baseHex;
	let hexagonList = [];
	
	this.fillMap = function(width, height) {
		baseHex = new hexagonPackage.Hexagon(0, 0, 150);
		hexagonList.push(baseHex);	
	}
	
	this.draw = function (context) {
		for (hexagon of hexagonList) {
			hexagon.draw(context);
		}
	}
}

module.exports = GameMap;
},{"./hexagon":3}],3:[function(require,module,exports){
let pointPackage = require('./point')

module.exports = {
	Hexagon,
	adjacentHexagon
}

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

	let points = [
		new pointPackage.Point(x + edgeSize / 2.0				, y								),
		new pointPackage.Point(x + width - edgeSize / 2.0, y								),
		new pointPackage.Point(x + width									, y + height / 2.0),
		new pointPackage.Point(x + width - edgeSize / 2.0, y + height			),
		new pointPackage.Point(x + edgeSize / 2.0				, y + height			),
		new pointPackage.Point(x													, y + height / 2.0)
	];
	
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
},{"./point":4}],4:[function(require,module,exports){
module.exports = {
	Point
}

/*
	2D space point
*/
function Point(conX, conY) {
	let x = conX;
	let y = conY;
	this.setX = function(newX) { x = newX; };
	this.setY = function (newY) { y = newY; };
	this.getX = function () { return x; };
	this.getY = function () { return y; };
}

},{}]},{},[1]);

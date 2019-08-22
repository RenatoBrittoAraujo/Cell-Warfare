let Point = require('./point');
let Team = require('./team');

const hexagonalDirection = {
	TOP_LEFT: 0,
	TOP: 1,
	TOP_RIGHT: 2,
	BOTTOM_LEFT: 3,
	BOTTOM: 4,
	BOTTOM_RIGHT: 5
};

const fortificationMax = 10;

/*
	Returns a new intance of a regular hexagon object with horizontal total span of width
*/
function Hexagon(x, y, width) {

	let height = width * Math.sqrt(3.0) / 2.0;
	let edgeSize = width / 2.0;

	let points = [];
	let neighbors = [];

	this.addNeighbor = function(neighbor) {
		neighbors.push(neighbor);
	} 

	this.getNeighbors = function() {
		return neighbors;
	}
	
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

	let changeColor = () => {
		if (this.hasTeam()) {
			this.setColor(team.fortificationColor(fortification));
		} else {
			this.setColor('rgb(180, 180, 180)');
		}
	}

	let team = null;

	let fortification = 0;

	this.addFortification = () => { 
		fortification++;
		if (fortification > fortificationMax) {
			fortification = fortificationMax;
		}
		changeColor();
	}

	this.isAtCapFortification = () => {
		return fortification == fortificationMax;
	}

	this.removeFortification = () => { 
		fortification--; 
		if (fortification <= 0) {
			team.removeHexagon(this);
			team = null;
		}
		changeColor();
	}

	this.getFortification = () => { return fortification; }

	this.setTeam = function(newTeam) {
		team = newTeam;
	}

	this.colonize = function(newTeam, newFortification = 1) {
		this.setTeam(newTeam);
		fortification = newFortification;
		this.setColor(team.fortificationColor(newFortification));
	}

	this.setTeam = function(newTeam) {
		team = newTeam
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
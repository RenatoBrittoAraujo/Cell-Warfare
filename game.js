let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hexagonalDirection = {
	TOP_LEFT: 0,
	TOP: 1,
	TOP_RIGHT: 2,
	BOTTOM_LEFT: 3,
	BOTTOM: 4,
	BOTTOM_RIGHT: 5
};

(function mainGameLoop()
{
	setInterval(
		function() {

			clearCanvas();
			let hex = new Hexagon(100, 100, 200);
			hex.draw();

			let other = adjacentHexagon(hex, hexagonalDirection.BOTTOM);
			other.setColor('rgb(100, 100, 80)');
			other.draw();

			let awdawd = adjacentHexagon(hex, hexagonalDirection.BOTTOM_RIGHT);
			awdawd.setColor('rgb(100, 200, 80)');
			awdawd.draw();

			let kkk = adjacentHexagon(awdawd, hexagonalDirection.BOTTOM);
			kkk.setColor('rgb(100, 0, 80)');
			kkk.draw();

			let cudoce = adjacentHexagon(kkk, hexagonalDirection.TOP_RIGHT);
			cudoce.setColor('rgb(200, 100, 80)');
			cudoce.draw();

		}, 10)

})();

/*
	Clear canvas back to css background-color
*/
function clearCanvas() {
	context.clearRect(0, 0, innerWidth, innerHeight);
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

/*
	Returns a new intance of a regular hexagon object with horizontal total span of width
*/
function Hexagon(x, y, width) {
/* PRIVATE */
	let height = width * Math.sqrt(3.0) / 2.0;
	let edgeSize = width / 2.0;

	let points = [
		new Point(x + edgeSize / 2.0				, y								),
		new Point(x + width - edgeSize / 2.0, y								),
		new Point(x + width									, y + height / 2.0),
		new Point(x + width - edgeSize / 2.0, y + height			),
		new Point(x + edgeSize / 2.0				, y + height			),
		new Point(x													, y + height / 2.0)
	];

	let color = 'rgb(0, 0, 0)';

/* PUBLIC */
	this.draw = function() {
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

/*
	Returns a new Hexagon adjacent to input hexagon off to the cited direction
*/
function adjacentHexagon(hexagon, direction) {

	const adjacentHexagonDistance = 3;
	let newX = 0;
	let newY = 0;
	let newWidth = hexagon.getWidth();
	let oldPosition = hexagon.getPosition();

	switch (direction) {
		case hexagonalDirection.TOP_LEFT:

			newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + adjacentHexagonDistance;
			newY = oldPosition.getY() + hexagon.getHeight() / 2 + adjacentHexagonDistance;
			break;
		case hexagonalDirection.TOP_RIGHT:

			newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + adjacentHexagonDistance / 2;
			newY = oldPosition.getY() - hexagon.getHeight() / 2 - adjacentHexagonDistance / 2;
			break;
		case hexagonalDirection.TOP:

			newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + adjacentHexagonDistance;
			newY = oldPosition.getY() + hexagon.getHeight() / 2 + adjacentHexagonDistance;
			break;
		case hexagonalDirection.BOTTOM_LEFT:

			newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + adjacentHexagonDistance;
			newY = oldPosition.getY() + hexagon.getHeight() / 2 + adjacentHexagonDistance;
			break;
		case hexagonalDirection.BOTTOM:

			newX = oldPosition.getX();
			newY = oldPosition.getY() + hexagon.getHeight() + adjacentHexagonDistance;
			break;
		case hexagonalDirection.BOTTOM_RIGHT:

			newX = oldPosition.getX() + hexagon.getWidth() * 3 / 4 + adjacentHexagonDistance / 2;
			newY = oldPosition.getY() + hexagon.getHeight() / 2 + adjacentHexagonDistance / 2;
			break;

	}
	return new Hexagon(newX, newY, newWidth);
}
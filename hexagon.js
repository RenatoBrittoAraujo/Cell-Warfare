$.getScript('point.js', (point) => {
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
});
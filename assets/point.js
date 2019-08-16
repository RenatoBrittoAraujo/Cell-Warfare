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

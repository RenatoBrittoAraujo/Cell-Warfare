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

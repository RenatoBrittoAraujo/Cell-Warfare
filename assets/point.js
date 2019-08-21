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

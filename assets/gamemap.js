let hexagonPackage = require('./hexagon')

const tileWidht = 100;

function GameMap() {
	
	let hexagonList = [];
	
	this.fillMap = function(width, height) {

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

		let baseHex = new hexagonPackage.Hexagon(0, 0, tileWidht);
		hexagonList.push(baseHex);
		makeLine(baseHex);
		let lastHex = baseHex;

		for (let i = 1; i < height; i++) {
			let newHex = hexagonPackage.adjacentHexagon(lastHex, hexagonPackage.hexagonalDirection.BOTTOM);
			hexagonList.push(newHex);
			makeLine(newHex);
			lastHex = newHex;
		}
	}
	
	this.draw = function (context) {
		for (hexagon of hexagonList) {
			hexagon.draw(context);
		}
	}
}

module.exports = GameMap;
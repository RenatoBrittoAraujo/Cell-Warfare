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
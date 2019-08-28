const minFortification = 40;
const fortificationLevels = 10;
const fortificationBlack = 15;

let Team = function() {
  
  let red = minFortification;
  let green = minFortification;
	let blue = minFortification;
	
	let money = 3;

	let hexagonsAttacked = [];

	this.canAttack = (hexagon) => {
		return true;
		for (hex of hexagonsAttacked) {
			if (hex == hexagon && hex.hasTeam()) {
				return false;
			}
		}
		return true;
	}

	this.attackedHexagon = (hexagon) => {
		hexagonsAttacked.push(hexagon);
	}

	let hexagonCount = 0;

	this.getHexagonCount = () => { return hexagonCount; }
  this.addHexagon = () => { hexagonCount++; }
  this.removeHexagon = () => { hexagonCount--; }

  this.setRed = (newRed) => { red = Math.floor(Math.max(Math.min(newRed, 255), minFortification)); }
  this.setGreen = (newGreen) => { green = Math.floor(Math.max(Math.min(newGreen, 255), minFortification)); }
  this.setBlue = (newBlue) => { blue = Math.floor(Math.max(Math.min(newBlue, 255), minFortification)); }

  this.runTurn = () => {
		hexagonsAttacked = [];
		if (hexagonCount == 1) {
			money++;
		} else {
			money += Math.floor(Math.random() * hexagonCount);
		}
	}
	
	this.spendMoney = () => { money--; }

  this.getMoney = () => { return money; }

	this.hasMoney = () => { return money > 0; }

  this.fortificationColor = function(level) {
    if (level < 1 || level > fortificationLevels) {
    }
    return 'rgb(' + 
      (Math.floor(Math.max((fortificationBlack - level) * (red - minFortification)) / fortificationBlack, 0) + minFortification) + ',' + 
			(Math.floor(Math.max((fortificationBlack - level) * (green - minFortification)) / fortificationBlack, 0) + minFortification) + ',' +
			(Math.floor(Math.max((fortificationBlack - level) * (blue - minFortification)) / fortificationBlack, 0) + minFortification) +
      ')';
  }

  this.capitalColor = function() {
    return 'rgb(' + red + ',' + green + ',' + blue + ')';
	}
	
	this.hasLost = () => { return hexagonCount <= 0; }
}

module.exports = Team;
const minFortification = 40;
const fortificationLevels = 10;

let Team = function() {
  
  let red = minFortification;
  let green = minFortification;
  let blue = minFortification;

  let hexagonCount = 1;
  let money = 0;

  this.addHexagon = () => { hexagonCount++; }
  this.removeHexagon = () => { hexagonCount--; }

  this.setRed = (newRed) => { red = Math.floor(Math.max(Math.min(newRed, 255), minFortification)); }
  this.setGreen = (newGreen) => { green = Math.floor(Math.max(Math.min(newGreen, 255), minFortification)); }
  this.setBlue = (newBlue) => { blue = Math.floor(Math.max(Math.min(newBlue, 255), minFortification)); }

  this.runTurn = () => {
    money += hexagonCount;
  }
  this.getMoney = () => { return money; }

  this.fortificationColor = function(level) {
    if (level < 1 || level > fortificationLevels) {
      console.log('INVALID FORTIFICATION LEVEL');
    }
    return 'rgb(' + 
      (Math.floor(Math.max((fortificationLevels - level) * (red - minFortification)) / fortificationLevels, 0) + minFortification) + ',' + 
      (Math.floor(Math.max((fortificationLevels - level) * (green - minFortification)) / fortificationLevels, 0) + minFortification) + ',' +
      (Math.floor(Math.max((fortificationLevels - level) * (blue - minFortification)) / fortificationLevels, 0) + minFortification) +
      ')';
  }

  this.capitalColor = function() {
    return 'rgb(' + red + ',' + green + ',' + blue + ')';
  }
}

module.exports = Team;
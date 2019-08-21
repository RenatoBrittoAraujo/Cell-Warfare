const capitalColorDelta = 0.8;
const minFortification = 70;
const fortificationLevels = 10;

let Team = function() {
  
  let red = minFortification;
  let green = minFortification;
  let blue = minFortification;

  let hexagonList = [];
  let money = 0;

  let capital;

  this.setCapital = (hexagon) => { capital = hexagon; }
  this.getCapital = () => { return capital; }
  this.isCapital = (hexagon) => { return hexagon == capital; }

  this.setRed = (newRed) => { red = Math.floor(Math.max(Math.min(newRed, 255), minFortification)); }
  this.setGreen = (newGreen) => { green = Math.floor(Math.max(Math.min(newGreen, 255), minFortification)); }
  this.setBlue = (newBlue) => { blue = Math.floor(Math.max(Math.min(newBlue, 255), minFortification)); }

  this.addHexagons = (hexagon) => {
    hexagonList.push(hexagon);
  }
  this.runTurn = () => {
    money += hexagonList.length;
  }
  this.getMoney = () => { return money; }

  this.fortificationColor = function(level) {
    if (level < 1 || level > fortificationLevels) {
      console.log('INVALID FORTIFICATION LEVEL');
    }
    return 'rgb(' + 
      (Math.floor(Math.max(level * (red * capitalColorDelta - minFortification)) / fortificationLevels, 0) + minFortification) + ',' + 
      (Math.floor(Math.max(level * (green * capitalColorDelta - minFortification)) / fortificationLevels, 0) + minFortification) + ',' +
      (Math.floor(Math.max(level * (blue * capitalColorDelta - minFortification)) / fortificationLevels, 0) + minFortification) + ',' +
      ')';
  }

  this.capitalColor = function() {
    return 'rgb(' + red + ',' + green + ',' + blue + ')';
  }
}

module.exports = Team;
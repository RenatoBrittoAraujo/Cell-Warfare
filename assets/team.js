let Team = function() {
  let color = 'rgb(0, 0, 0)';
  let hexagonList = [];
  let money = 0;
  this.setColor = (newColor) => { color = newColor; }
  this.addHexagons = (hexagon) => {
    hexagonList.push(hexagon);
  }
  this.runTurn = () => {
    money += hexagonList.length;
  }
  this.getMoney = () => { return money; }
}

module.exports = Team;
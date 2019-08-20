let hexagonPackage = require('hexagon');

function Team() {
  let numberOfHex = 0;
  this.colonizeMap = function(hexagonList) {
    if (hexagonList.lenght === 1) {
      return;
    }
    let index;
    do {
      index = Math.floor(Math.random() * hexagonList.lenght);
      if (index === hexagonList.lenght) {
        index--;
      } 
      numberOfHex = 1; 
    } while(hexagonList[index].hasTeam());
    
  }
}

module.exports = Team;
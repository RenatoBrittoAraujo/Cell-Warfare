$.getScript('hexagon.js', () => {
console.log('GAMEMAP')
function GameMap() {
/* PRIVATE */
  let baseHex;
  let hexagonList = [];
  
  /* PUBLIC */
  this.fillMap = function(width, height) {
    baseHex = new Hexagon(0, 0, 150);
    hexagonList += baseHex;
    
  }
  
  this.draw = function() {
    for (hexagon of hexagonList) {
      hexagon.draw();
    }
  }
}

});
let GameMap = require('./gamemap')

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

(function mainGameLoop()
{
	map = new GameMap();
	map.fillMap(20, 20);
	
	setInterval(
		function() {
			
			clearCanvas();
			map.draw(context);
			
	}, 10);
})();

/*
Clear canvas back to css background-color
*/
function clearCanvas() {
	context.clearRect(0, 0, innerWidth, innerHeight);
}

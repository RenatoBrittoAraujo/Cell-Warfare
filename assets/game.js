let GameMap = require('./gamemap');

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

(function mainGameLoop()
{
	let w = 1;
	let h = 1;
	map = new GameMap();
	map.fillMap(w, h);

	window.addEventListener('keypress', (e) => {
		if (e.key == 'd'|| e.key == 's') {
			if(e.key == 's') {
				h++;
			} else {
				w++;
			}
			map = new GameMap();
			map.fillMap(w, h);

		}
	});
	
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

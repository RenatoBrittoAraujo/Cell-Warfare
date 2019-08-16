let GameMap = require('./gamemap');
let Point = require('./point');

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
	map.setPosition(new Point(canvas.width / 2 - 100 / 2, canvas.height / 2 - 100 / 2 - 35))

	window.addEventListener('keypress', (e) => {
		switch (e.key) {
			case 'a':
				w = Math.max(w - 1, 1);
				break;
			case 'w':
				h = Math.max(h - 1, 1);
				break;
			case 's':
				h++;
				break;
			case 'd':
				w++;
				break;
		}
		map.fillMap(w, h);
		map.setPosition(new Point(
			canvas.width / 2 - map.getWidth() / 2,
			canvas.height / 2 - map.getHeight() / 2 - 35
		));
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
const FOOD_ELEMENT_COLOR = "Olive";

var snake;

$(document).ready(function() {
	$("#startSnake").click(init);
	$("#stopSnake").click(stop);
});

/**
	@function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
*/
function init() {
	console.log("game started");
	snake = createStartSnake();
	console.log("snake created");
	draw();
}

function stop() {
	snakeCanvas.clear();
	console.log("game stopped");
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
	snake.draw();
}

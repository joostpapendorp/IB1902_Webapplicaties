
const SNAKE_BODY_ELEMENT_COLOR = "DarkRed";
const FOOD_ELEMENT_COLOR = "Olive";
const SNAKE_HEAD_ELEMENT_COLOR = "DarkOrange";

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
	let element = new Element(ELEMENT_RADIUS, 360 / 2, 360 / 2, SNAKE_BODY_ELEMENT_COLOR);
	snakeCanvas.drawElement(element);
}

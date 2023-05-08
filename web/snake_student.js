const ELEMENT_RADIUS = 10;
const ELEMENT_DIAMETER = 2 * ELEMENT_RADIUS;

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

/**
   @constructor Element
   @param radius straal
   @param {number} x x-coordinaat middelpunt
   @param {number} y y-coordinaat middelpunt
   @param {string} color kleur van het element
*/
function Element(radius, x, y, color) {
		this.radius = radius,
		this.x = x,
		this.y = y,
		this.color = color
}

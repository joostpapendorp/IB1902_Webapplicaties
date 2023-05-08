const ELEMENT_RADIUS = 10;
const ELEMENT_DIAMETER = 2 * ELEMENT_RADIUS;

const SNAKE_BODY_ELEMENT_COLOR = "DarkRed";
const FOOD_ELEMENT_COLOR = "Olive";
const SNAKE_HEAD_ELEMENT_COLOR = "DarkOrange";

var canvasWidth;
var canvasHeight;


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
	$("#mySnakeCanvas").clearCanvas();
	console.log("game stopped");
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
	console.log( "drawing...");
	var canvas = $("#mySnakeCanvas").clearCanvas();
	var element = new Element(ELEMENT_RADIUS, 360 / 2, 360 / 2, SNAKE_BODY_ELEMENT_COLOR);
	drawElement(canvas, element);
	console.log(element);
}

/**
   @constructor Element
   @param radius straal
   @param {number} x x-coordinaat middelpunt
   @param {number} y y-coordinaat middelpunt
   @param {string} color kleur van het element
*/
function Element(radius, x, y, color) {
		return {
			radius: radius,
			x: x,
			y: y,
			color: color
		};
}

/**
  @function drawElement(element, canvas) -> void
  @desc Een element tekenen
  @param {Element} element een Element object
  @param  {dom object} canvas het tekenveld
*/
function drawElement(canvas, element) {
	canvas.drawArc({
		draggable : false,
		fillStyle : element.color,
		x : element.x,
		y : element.y,
		radius : element.radius
	});
}

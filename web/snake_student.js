
const SNAKE_HEAD_ELEMENT_COLOR = "DarkOrange";
const SNAKE_BODY_ELEMENT_COLOR = "DarkRed";

const FOOD_ELEMENT_COLOR = "Olive";

var width = 360;
var height = 360;

const HORIZONTAL_GRID_SIZE = Math.floor(width / ELEMENT_DIAMETER);
const VERTICAL_GRID_SIZE = Math.floor(height / ELEMENT_DIAMETER);

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

var snake;

/**
   @constructor Snake
   @param {[Element] segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang
*/
function Snake(segments) {
	this.segments = segments;

	this.draw = function(){
    	segments.forEach( element => element.draw() );
	};
}

/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten,
        in het midden van het veld
  @return: slang volgens specificaties
*/
function createStartSnake() {
	let centralXTile = Math.floor(HORIZONTAL_GRID_SIZE/2)-1;
	let centralYTile = Math.floor(VERTICAL_GRID_SIZE/2)-1;
	var segments = [
		createSegment(
			centralXTile * ELEMENT_DIAMETER + ELEMENT_RADIUS,
			centralYTile * ELEMENT_DIAMETER + ELEMENT_RADIUS,
			SNAKE_BODY_ELEMENT_COLOR),
	  createSegment(
	    (centralXTile + 1) * ELEMENT_DIAMETER + ELEMENT_RADIUS,
		  centralYTile * ELEMENT_DIAMETER + ELEMENT_RADIUS,
		  SNAKE_HEAD_ELEMENT_COLOR),
  ];

  return new Snake(segments);
}

/**
  @function createSegment(x,y) -> Element
  @desc Slangsegment creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal ELEMENT_RADIUS en color SNAKE_BODY_ELEMENT_COLOR
*/
function createSegment(x, y, color) {
	return new Element(ELEMENT_RADIUS, x, y, color);
}

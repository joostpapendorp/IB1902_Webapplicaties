const ELEMENT_RADIUS = 10;
const ELEMENT_DIAMETER = 2 * ELEMENT_RADIUS;

const HORIZONTAL_GRID_SIZE = Math.floor(width / ELEMENT_DIAMETER);
const VERTICAL_GRID_SIZE = Math.floor(height / ELEMENT_DIAMETER);

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

		this.draw = function(){
			snakeCanvas.drawElement(this);
		}
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

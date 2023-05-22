const SNAKE_HEAD_ELEMENT_COLOR = "DarkOrange";
const SNAKE_BODY_ELEMENT_COLOR = "DarkRed";

/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten,
        in het midden van het veld
  @return: slang volgens specificaties
*/
function createStartSnake() {
	let centralXTile = Math.floor(HORIZONTAL_GRID_SIZE / 2) - 1;
	let centralYTile = Math.floor(VERTICAL_GRID_SIZE / 2) - 1;

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

	let segments = [
		createElement(
			centralXTile * ELEMENT_DIAMETER + ELEMENT_RADIUS,
			centralYTile * ELEMENT_DIAMETER + ELEMENT_RADIUS,
			SNAKE_BODY_ELEMENT_COLOR),
	  createElement(
	    (centralXTile + 1) * ELEMENT_DIAMETER + ELEMENT_RADIUS,
		  centralYTile * ELEMENT_DIAMETER + ELEMENT_RADIUS,
		  SNAKE_HEAD_ELEMENT_COLOR),
  ];

	let snake = new Snake(segments);

  return {
    draw: function(){
      snake.draw();
    }
  };
}

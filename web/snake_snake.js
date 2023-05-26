"use strict";

const SNAKE_HEAD_COLOR = "DarkOrange";
const SNAKE_BODY_COLOR = "DarkRed";

/**
	@function createStartSnake() -> Snake
	@desc Slang creëren, bestaande uit  twee segmenten, in het midden van het veld
	@return: slang volgens specificaties
*/
function createStartSnake(board) {
	let centralTile = Math.floor(BOARD_SIZE / 2) - 1;

	/**
		@constructor Snake
		@param {[Element] segments een array met aaneengesloten slangsegmenten Het laatste element van segments wordt de kop van de slang
	*/
	function Snake(segments) {
		this.segments = segments;

		this.draw = function(){
      segments.forEach( element => element.draw() );
    };
	}

	let bodySegment = board.createElement(
		createLocation(centralTile, centralTile),
		SNAKE_BODY_COLOR);

	let headSegment = board.createElement(
		createLocation(centralTile + 1, centralTile),
		SNAKE_HEAD_COLOR);

	let snake = new Snake([bodySegment, headSegment]);

  return {
    draw: function(){
      snake.draw();
    }
  };
}

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
	let locations = [
		createLocation(centralTile, centralTile),
		createLocation(centralTile + 1, centralTile)
	];

	return createSnake(board, locations);
}

function createSnake(board, locations){
	/**
		@constructor Snake
		@param {[Element] segments een array met aaneengesloten slangsegmenten Het laatste element van segments wordt de kop van de slang
	*/
	function Snake(segments) {
		this.segments = segments;
	}

	let elements = [];
	for(let i = 0; i < locations.length - 1; i++ ){
		let bodyElement = board.createElement(
			locations[i],
			SNAKE_BODY_COLOR);
		elements.push(bodyElement);
	}

	let headElement = board.createElement(
		locations[ locations.length -1],
		SNAKE_HEAD_COLOR);
	elements.push(headElement)

	let snake = new Snake(elements);

  return {
  };
}

const SNAKE_CANVAS_ID = "mySnakeCanvas"

const FOOD_ELEMENT_COLOR = "Olive";

// TODO last global
var game;

$(document).ready(function() {
	// note: we MUST use onDocumentReady here, since the canvas might not be initialized otherwise, resulting in an empty jQuery object
	game = buildInjectionContext();

	$("#startSnake").click(init);
	$("#stopSnake").click(stop);
});

function buildInjectionContext(){
	let canvasDOMElement = $("#"+SNAKE_CANVAS_ID);
	let canvas = createCanvas(canvasDOMElement);
	let board = createBoard(canvas);
	let snakeFactory = createSnakeFactory(board);

	return {
		board : board,
		snakeFactory : snakeFactory
	};
}

/**
	@function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
*/
function init() {
	console.log("game started");
	snake = createStartSnake(game.snakeFactory);
	console.log("snake created");
	draw();
}

function stop() {
	game.board.clear();
	console.log("game stopped");
}

/**
	@function createStartSnake() -> Snake
	@desc Slang creëren, bestaande uit  twee segmenten, in het midden van het veld
	@return: slang volgens specificaties
*/
function createStartSnake(snakeFactory) {
	let centralTile = Math.floor(BOARD_SIZE / 2) - 1;
	let locations = [
		createLocation(centralTile, centralTile + 1),
		createLocation(centralTile, centralTile)
	];

	return snakeFactory.createSnake(locations);
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
	game.board.redraw();
}

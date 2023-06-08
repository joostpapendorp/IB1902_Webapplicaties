"use strict";

const SNAKE_CANVAS_ID = "mySnakeCanvas";

const FOOD_ELEMENT_COLOR = "Olive";

$(document).ready(function() {
	// note: we MUST construct the context onDocumentReady, since we need the html canvas JQuery object.
  // It might not be initialized beforehand.
	let game = buildInjectionContext();

	$("#startSnake").click(()=>game.start());
	$("#stopSnake").click(()=>game.stop());
});

function buildInjectionContext(){
	let canvasDOMElement = $("#"+SNAKE_CANVAS_ID);
	let board = createBoard(
		createCanvas(canvasDOMElement),
		createElementFactory()
	);

	let snakeFactory = createSnakeFactory(board);

	return createGame(
		board,
		snakeFactory.createSnake,
		createEngine,
		createTimer()
	);
}

"use strict";

const SNAKE_CANVAS_ID = "mySnakeCanvas";

const FOOD_ELEMENT_COLOR = "Olive";

$(document).ready(function() {
	// note: we MUST construct the context onDocumentReady, since we need the html canvas JQuery object.
  // It might not be initialized beforehand.
	let context = buildInjectionContext();

	$("#startSnake").click(()=>context.start());
	$("#stopSnake").click(()=>context.stop());

	$(document).keydown(function (event) {
		context.receiveInput(event.which);
  });
});

function buildInjectionContext(){
	let canvasDOMElement = $("#"+SNAKE_CANVAS_ID);
	let board = createBoard(
		createCanvas(canvasDOMElement),
		createElementFactory()
	);

	let snakeFactory = createSnakeFactory(board);

	let game = createGame(
		board,
		snakeFactory.createSnake,
		createEngine,
		createTimer()
	);
	let player = createPlayer(game);

	return {
		start: () => game.start(),
		stop: () => game.stop(),
		receiveInput: (code) => player.receive(code)
	}
}

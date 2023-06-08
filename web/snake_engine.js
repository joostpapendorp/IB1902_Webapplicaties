"use strict";

function createEngine(board,snake){

	function Engine(board, snake){
		this.board = board;
		this.snake = snake;

		this.tick = function(direction){
			snake.move(direction);
			board.redraw();
		}
	}

	let engine = new Engine(board, snake);
	Object.freeze(engine);

	return engine;
}

"use strict";

function createGame(
	board,
	buildSnake,
	buildEngine,
	timer
){
	function Game(board){
		this.timer = timer;

		/**
			@function init() -> void
		  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
		*/
		this.start = function() {
			console.log("game started");

			let snake = createStartSnake();
			console.log("snake created");

			let engine = buildEngine(board, snake);

			board.redraw();

			this.timer.start(
				() => engine.tick(UP)
			);
		}

		this.stop = function() {
			board.clear();
			this.timer.stop();
			console.log("game stopped");
		}
	}

	/**
		@function createStartSnake() -> Snake
		@desc Slang creëren, bestaande uit  twee segmenten, in het midden van het veld
		@return: slang volgens specificaties
	*/
	function createStartSnake() {
		let centralTile = Math.floor(BOARD_SIZE / 2) - 1;
		let locations = [
			createLocation(centralTile, centralTile + 1),
			createLocation(centralTile, centralTile)
		];

		return buildSnake(locations);
	}

	let game = new Game(board);
	Object.freeze(game);

	return game;
}

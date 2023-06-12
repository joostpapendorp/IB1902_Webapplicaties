"use strict";

function createGame(
	buildSnake,
	prepareEngineWith,
	player
){
	function Game(player){
		this.engine;
		this.player = player;

		/**
			@function init() -> void
		  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
		*/
		this.start = function() {
			let snake = createStartSnake();
			console.log("snake created");

			this.engine = prepareEngineWith(snake, UP);
			this.engine.start();

			console.log("game started");
		};

		this.stop = function() {
			this.engine.shutDown();
			console.log("game stopped");
		};

		this.receiveKeyInput = function(keyCode) {
			let direction = player.receive(keyCode);
			if(direction !== NO_LOCATION)
				this.engine.steer(direction);
		};
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

	let game = new Game(player);

	return {
		start : () => game.start(),
		stop : () => game.stop(),
		receiveKeyInput: (code) => game.receiveKeyInput(code)
	};
}

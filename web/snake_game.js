"use strict";

function createGame(
	difficulty,
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
			console.log("initializing...")
			this.engine = prepareEngineWith(difficulty);
			console.log("...done.");

			this.engine.start();
			console.log("game started.");
		};

		this.stop = function() {
			this.engine.shutDown();
			console.log("game stopped.");
		};

		this.receiveKeyInput = function(keyCode) {
			let direction = player.receive(keyCode);
			if(direction !== NO_LOCATION)
				this.engine.steer(direction);
		};
	}

	let game = new Game(player);

	return {
		start : () => game.start(),
		stop : () => game.stop(),
		receiveKeyInput: (code) => game.receiveKeyInput(code)
	};
}

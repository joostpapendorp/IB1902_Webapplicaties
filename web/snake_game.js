"use strict";

export function createGame(
	difficulties,
	prepareEngineWith,
	player,
	storage
){
	function Game(player){
		this.engine;
		this.storage = storage;
		this.player = player;

		/**
			@function init() -> void
		  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
		*/
		this.start = function() {
			if(this.engine) {
				console.log("stopping running game.");
				this.stop();
				console.log("restarting...");
			}
			else
				console.log( "starting game...");

			let difficulty = difficulties[0];
			console.log(`initializing engine at ${difficulty.name} difficulty...`)
			let chosenRuleSet = difficulty.ruleSet(storage);
			this.engine = prepareEngineWith(chosenRuleSet);
			console.log("...done.");

			this.engine.start();
			console.log("game started.");
		};

		this.stop = function() {
			if(this.engine) {
				this.engine.shutDown();
				this.engine = undefined;
				console.log("game stopped.");
			}
			else
				console.log("nothing to stop.")
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

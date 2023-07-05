import {STEER_COMMAND_TYPE, PAUSE_COMMAND_TYPE, NO_COMMAND_TYPE} from "./snake_player.js";
import {createState} from "./snake_state.js";

"use strict";

const APP_STOPPED_STATE = createState("APP STOPPED");
const APP_STARTED_STATE = createState("APP STARTED");

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
		this.state = APP_STOPPED_STATE;

		this.start = function() {
			switch(this.state)
			{
				case APP_STARTED_STATE:
					console.log("stopping running game.");
					this.stop();
					console.log("restarting...");
					break;

				case APP_STOPPED_STATE:
					console.log( "starting game...");
					break;
			}

			let difficulty = difficulties[0];
			console.log(`initializing engine at ${difficulty.name} difficulty...`)
			let chosenRuleSet = difficulty.ruleSet(storage);
			this.engine = prepareEngineWith(chosenRuleSet);
			console.log("...done.");

			this.engine.start();
			this.state = APP_STARTED_STATE;
			console.log("game started.");
		};

		this.stop = function() {
			switch(this.state)
			{
				case APP_STARTED_STATE:
					this.engine.shutDown();
					this.engine = undefined;
					this.state = APP_STOPPED_STATE;
					console.log("game stopped.");
					break;

				case APP_STOPPED_STATE:
					console.log("nothing to stop.")
					break;
			}
		};

		this.receiveKeyInput = function(keyCode) {
			switch(this.state)
			{
				case APP_STARTED_STATE:
					let command = player.receive(keyCode);
					console.log(`received ${command.type.description}`);

					switch(command.type){
						case STEER_COMMAND_TYPE:
							this.engine.steer(command.target);
							break;

						case PAUSE_COMMAND_TYPE:
							this.engine.togglePause();
							break;

						case NO_COMMAND_TYPE:
							break;
					}
					break;

				case APP_STOPPED_STATE:
					console.log("stopped app does not process key commands.")
					break;
			}
		};
	}

	let game = new Game(player);

	return {
		start : () => game.start(),
		stop : () => game.stop(),
		receiveKeyInput: (code) => game.receiveKeyInput(code)
	};
}

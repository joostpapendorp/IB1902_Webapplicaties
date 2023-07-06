import {START_NEW_GAME_COMMAND_TYPE, STEER_COMMAND_TYPE, PAUSE_COMMAND_TYPE} from "./snake_player.js";
import {createState} from "./snake_state.js";

"use strict";

const APP_STARTED_STATE = createState("APP STARTED");
const APP_RUNNING_STATE = createState("APP RUNNING");
const APP_STOPPED_STATE = createState("APP STOPPED");

export function createGame(
	difficulties,
	prepareEngineWith,
	player,
	storage,
	showIntro
){
	function Game(player){
		this.engine;
		this.storage = storage;
		this.player = player;
		this.state = APP_STOPPED_STATE;

		this.startApp = function() {
			switch(this.state)
			{
				case APP_STARTED_STATE:
					console.log( "app has already started.");
					break;

				case APP_RUNNING_STATE:
					console.log("stopping running game.");
					this.stopApp();
					console.log("restarting the app...");
					showIntro();
					break;

				case APP_STOPPED_STATE:
					console.log( "starting the app...");
					showIntro();
					break;
			}
			this.state = APP_STARTED_STATE;
		};

		this.startNewGame = function(){
			let difficulty = difficulties[0];
			console.log(`initializing engine at ${difficulty.name} difficulty...`)
			let chosenRuleSet = difficulty.ruleSet(storage);
			this.engine = prepareEngineWith(chosenRuleSet);
			console.log("...done.");

			this.engine.start();
			this.state = APP_RUNNING_STATE;
			console.log("game started.");
		};

		this.stopApp = function() {
			switch(this.state)
			{
				case APP_STARTED_STATE:
					this.state = APP_STOPPED_STATE;
					console.log("game stopped.");
					break;

				case APP_RUNNING_STATE:
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
			let command = player.receive(keyCode);
			console.log(`received ${command.type.description}`);

			switch(this.state)
			{
				case APP_STARTED_STATE:
					switch(command.type){
						case START_NEW_GAME_COMMAND_TYPE:
							this.startNewGame();
							break;

						default:
							console.log(`idle app does not process ${command.type.description}`)
							break;
					}
					break;

				case APP_RUNNING_STATE:
					switch(command.type){
						case STEER_COMMAND_TYPE:
							this.engine.steer(command.target);
							break;

						case PAUSE_COMMAND_TYPE:
							this.engine.togglePause();
							break;

						default:
							console.log(`running app does not process ${command.type.description}`)
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
		start : () => game.startApp(),
		stop : () => game.stopApp(),
		receiveKeyInput: (code) => game.receiveKeyInput(code)
	};
}

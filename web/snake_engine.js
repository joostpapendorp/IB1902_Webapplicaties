import {createLocation} from "./snake_location.js";
import {BOARD_SIZE} from "./snake_board.js";
import {createState} from "./snake_state.js";

"use strict";


export const GAME_READY_STATE = createState("Game ready");
export const GAME_RUNNING_STATE = createState("Game running");
export const GAME_PAUSED_STATE = createState("Game paused");
export const GAME_OVER_STATE = createState("Game over");
export const GAME_WON_STATE = createState("Game won");

export const CENTRAL_TILE = createLocation(BOARD_SIZE/2, BOARD_SIZE/2);

const GAME_PAUSED_TEXT = "*** GAME PAUSED ***";

export function createEngineFactory(board, timer, splashScreen){
	let factory = new EngineFactory(board, timer, splashScreen);
	Object.freeze(factory);
	return factory;
}

function EngineFactory(board, timer, splashScreen){
	this.board = board;
	this.timer = timer;
	this.splashScreen = splashScreen;

	this.prepareEngineWith = function(rules){
		let engine = new Engine(board, timer, splashScreen, rules);

		return {
			start: () => engine.start(),
			tick: () => engine.tick(), //public though indirection (Timer)
			steer: (direction) => engine.steer(direction),
			halt: () => engine.halt(), //public for testing
			shutDown : () => engine.shutDown(),
			togglePause : () => engine.togglePause()
		};
	};
}

function Engine(board, timer, splashScreen, rules){
	this.board = board;
	this.timer = timer;
	this.splashScreen = splashScreen;

	this.rules = rules;
	this.snake = this.rules.createStartSnake(this.board);
	this.direction = this.rules.initialDirection();
	this.state = this.rules.prepare();

	this.start = function(){
		this.state = this.rules.start();
		this.board.redraw();
		this.timer.start(() => this.tick());
	};

	this.tick = function(){
		switch(this.state){
			case GAME_RUNNING_STATE:
				this.act();
				break;

			default:
				break;
		}
	};

	this.act = function(){
		let result = this.snake.push(this.direction);
		this.state = this.rules.update(result);

		this.board.redraw();

		switch(this.state) {
			case GAME_OVER_STATE:
				this.gameOver();
				break;

			case GAME_WON_STATE:
				this.gameWon();
				break;

			default:
				break;
		}
	};

	this.gameOver = function(){
		this.halt();
		this.splashScreen.writeGameOver(board);
		writeTalliedScores(this.board, () => rules.gameLost());
	};

	this.gameWon = function(){
		this.halt();
		this.splashScreen.writeGameWon(board);
		writeTalliedScores(this.board, () => rules.gameWon());
	};

	async function writeTalliedScores(board, tally){
		let tallyText = await tally();
		board.writeAt(CENTRAL_TILE, tallyText);
	}

	this.steer = function(direction){
		switch(this.state) {
			case GAME_RUNNING_STATE:
				this.direction = direction;
				break;

			default:
				break;
		}
	};

	this.togglePause = function(){
		switch(this.state) {
			case GAME_RUNNING_STATE:
				this.pause();
				break;

			case GAME_PAUSED_STATE:
				this.unpause();
				break;

			default:
				break;
		}
	};

	this.pause = function(){
		this.timer.stop();
		this.board.writeAt(CENTRAL_TILE, GAME_PAUSED_TEXT);
		this.state = GAME_PAUSED_STATE;
	};

	this.unpause = function(){
		this.timer.start(() => this.tick());
		this.board.redraw();
    this.state = GAME_RUNNING_STATE;
	};

	this.halt = function(){
		switch(this.state){
			case GAME_PAUSED_STATE:
				// timer is already stopped, don't stop again.
				break;

			default:
				this.timer.stop();
				break;
		}
	};

	this.shutDown = function(){
		switch(this.state){
			case GAME_RUNNING_STATE:
			case GAME_PAUSED_STATE:
				this.halt();
				break;

			default:
				break;
		}

		this.board.clear();
	};
}

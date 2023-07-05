import {createLocation} from "./snake_location.js";
import {BOARD_SIZE} from "./snake_board.js";
import {createState} from "./snake_state.js";

"use strict";


export const GAME_READY_STATE = createState("Game ready");
export const GAME_RUNNING_STATE = createState("Game running");
export const GAME_PAUSED_STATE = createState("Game paused");
export const GAME_OVER_STATE = createState("Game over");
export const GAME_WON_STATE = createState("Game won");

export const CENTRAL_TILE = createLocation(BOARD_SIZE/2, BOARD_SIZE/2)

const GAME_PAUSED_TEXT = "*** GAME PAUSED ***"

export function createEngineFactory(board, timer, splashScreen){
	function Engine(board, timer, rules){
		this.board = board;
		this.timer = timer;

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
			if(this.state !== GAME_PAUSED_STATE){
				let result = this.snake.push(this.direction);
				this.state = this.rules.update(result);

				this.board.redraw();

				switch(this.state) {
					case GAME_RUNNING_STATE:
						break;

					case GAME_OVER_STATE:
						this.halt();
						splashScreen.writeGameOver(board);
						writeTalliedScores(this.board, () => rules.gameLost());
						break;

					case GAME_WON_STATE:
						this.halt();
						splashScreen.writeGameWon(board);
						writeTalliedScores(this.board, () => rules.gameWon());
						break;
				}
			}
		};

		async function writeTalliedScores(board, tally){
			let tallyText = await tally();
			board.writeAt(CENTRAL_TILE, tallyText);
		}

		this.steer = function(direction){
			if( this.state !== GAME_PAUSED_STATE)
				this.direction = direction;
		};

		this.togglePause = function(){
			switch(this.state) {
				case GAME_RUNNING_STATE:
					this.timer.stop();
					this.board.writeAt(CENTRAL_TILE, GAME_PAUSED_TEXT);
					this.state = GAME_PAUSED_STATE;
					break;

				case GAME_PAUSED_STATE:
					this.timer.start(() => this.tick());
					this.state = GAME_RUNNING_STATE;
					break;

				case GAME_READY_STATE:
				case GAME_OVER_STATE:
				case GAME_WON_STATE:
					break;
			}
		}

		this.halt = function(){
			switch(this.state){
				case GAME_PAUSED_STATE:
					// timer is already stopped, don't stop again.
					break;

				default:
					this.timer.stop();
			}
		};

		this.shutDown = function(){
			if(this.state === GAME_RUNNING_STATE)
				this.halt();

			this.board.clear();
		};
	}

	function prepareEngineWith(rules){
		let engine = new Engine(board, timer, rules);

		return {
			start: () => engine.start(),
			tick: () => engine.tick(), //public for testing
			steer: (direction) => engine.steer(direction),
			halt: () => engine.halt(), //public for testing
			shutDown : () => engine.shutDown(),
			togglePause : () => engine.togglePause()
		};
	}

	return {
		prepareEngineWith : (rules) => prepareEngineWith(rules)
	};
}

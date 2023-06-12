"use strict";

const INITIAL_DIRECTION = UP;
const NUMBER_OF_FOODS_PER_BASIC_GAME = 5;

const NEW_GAME_STATE = createGameState("New game");
const GAME_RUNNING_STATE = createGameState("Game running");
const GAME_OVER_STATE = createGameState("Game over");
const GAME_WON_STATE = createGameState("Game won");

function ruleSets(foodPlanter) {

	function BasicRuleSet(foodPlanter){
		this.foodPlanter = foodPlanter;
		this.foodLeft;

		this.initialDirection = function(){
			return INITIAL_DIRECTION;
		};

		this.prepare = function(){
			for(let i = 0; i < NUMBER_OF_FOODS_PER_BASIC_GAME; i++ )
				foodPlanter.plant();

			this.foodLeft = NUMBER_OF_FOODS_PER_BASIC_GAME;

			return NEW_GAME_STATE;
		};

		this.start = function() {
			return GAME_RUNNING_STATE;
		};

		this.update = function(result) {
			switch(result) {
				case SNAKE_DIED:
					return GAME_OVER_STATE;

				case SNAKE_ATE:
					this.foodLeft --;
					if(this.foodLeft === 0)
						return GAME_WON_STATE;
					else
						return GAME_RUNNING_STATE;

				case SNAKE_MOVED:
					return GAME_RUNNING_STATE;

				default:
					throw new Error("Unknown stat");
			}
		};

		function halt(text) {
			return STATE_HALT;
		}
	}

	// poor mans polymorphism:
	function basic() {
		return buildRuleSet(BasicRuleSet);
	}

	function buildRuleSet(constructor) {
		let ruleSet = new constructor(foodPlanter);

		return {
			initialDirection : () => ruleSet.initialDirection(),
			initialState : () => ruleSet.initialState(),
			prepare : () => ruleSet.prepare(),
			start : () => ruleSet.start(),
			update : (result) => ruleSet.update(result)
		}
	}

	return {
		basic : () => basic(),
	}
}

function createGameState(description){
	function GameState(description){
		this.description = description;
	}

	let state = new GameState(description);
	Object.freeze(state);
	return state;
}

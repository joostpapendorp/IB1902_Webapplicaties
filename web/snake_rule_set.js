import {createLocation} from "./snake_location.js";
import {BOARD_SIZE} from "./snake_board.js";
import {
	SNAKE_MOVED,
	SNAKE_DIED,
	SNAKE_ATE,
} from "./snake_snake.js";
import {MOVE_UP} from "./snake_player.js";
import {
	GAME_READY_STATE,
	GAME_RUNNING_STATE,
	GAME_OVER_STATE,
	GAME_WON_STATE
} from "./snake_engine.js";

"use strict";


export const INITIAL_DIRECTION = MOVE_UP;
export const NUMBER_OF_FOODS_PER_BASIC_GAME = 5;
export const NUMBER_OF_FOODS_IN_CONTINUOUS_PLAY_GAME = 2;

export const GAME_RESULT_WIN = {result:"win"};
export const GAME_RESULT_LOSS = {result:"loss"};

export function difficulties(ruleSets){

	let basic = new Difficulty(
		"Basic",
		"Eat all the food to win.",
		(storage) => ruleSets.basic(storage.requestStorage("Basic"))
	);
	Object.freeze(basic);

	let continuousPlay = new Difficulty(
		"Continuous Play",
		"Eat as many foods as you can.",
		(storage) => ruleSets.continuousPlay(storage.requestStorage("Continuous"))
	);
	Object.freeze(continuousPlay);

	return [basic, continuousPlay];
}

export function ruleSets(createSnake, foodPlanter) {
	function basic(highScores) {
		let basicRuleSet = new BasicRuleSet(createSnake, foodPlanter, highScores);
		return facadeFor(basicRuleSet);
	}

	function continuousPlay(highScores){
		let continuousPlayRuleSet = new ContinuousPlayRuleSet(createSnake, foodPlanter, highScores);
		return facadeFor(continuousPlayRuleSet);
	}

	function facadeFor(ruleSet) {
		return {
			initialDirection : () => ruleSet.initialDirection(),
			createStartSnake : (board) => ruleSet.createStartSnake(board),
			prepare : () => ruleSet.prepare(),
			start : () => ruleSet.start(),
			update : (result) => ruleSet.update(result),
			gameWon : () => ruleSet.gameWon(),
			gameLost : () => ruleSet.gameLost(),
		}
	}

	return {
		basic : (storage) => basic(storage),
		continuousPlay : (storage) => continuousPlay(storage)
	}
}

function Difficulty(name, description, ruleSet){
	this.name = name;
	this.description = description;
	this.ruleSet = ruleSet;
}

function RuleSetPrototype(){

	this.initialDirection = function(){
		return INITIAL_DIRECTION;
	};

	this.defaultStartSnake = function(createSnake, board) {
		let centralTile = Math.floor(BOARD_SIZE / 2) - 1;
		let locations = [
			createLocation(centralTile, centralTile + 1),
			createLocation(centralTile, centralTile)
		];

		return createSnake(board, locations);
	}

	this.start = function() {
		return GAME_RUNNING_STATE;
	};
};

function BasicRuleSet(createSnake, foodPlanter, highScores){
	this.createSnake = createSnake;
	this.foodPlanter = foodPlanter;
	this.highScores = highScores;
	this.foodLeft;

	this.prepare = function(){
		for(let i = 0; i < NUMBER_OF_FOODS_PER_BASIC_GAME; i++ )
			foodPlanter.plant();

		this.foodLeft = NUMBER_OF_FOODS_PER_BASIC_GAME;

		return GAME_READY_STATE;
	};

	this.createStartSnake = function(board) {
		return this.defaultStartSnake(createSnake, board);
	}

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
				throw new Error("Unknown state");
		}
	};

	this.gameWon = function(){
		highScores.add(GAME_RESULT_WIN);
		return tallyResults();
	};

	this.gameLost = function(){
		highScores.add(GAME_RESULT_LOSS);
		return tallyResults();
	};

	async function tallyResults() {
		let wins = await highScores.count(GAME_RESULT_WIN);
    let losses = await highScores.count(GAME_RESULT_LOSS);

    return `*** Wins: ${wins} *** Losses: ${losses} ***`;
	}
}
BasicRuleSet.prototype = new RuleSetPrototype();


function ContinuousPlayRuleSet(createSnake, foodPlanter, highScores){
	this.createSnake = createSnake;
	this.foodPlanter = foodPlanter;
	this.highScores = highScores;

	this.score = 0;

	this.prepare = function(){
		for(let i = 0; i < NUMBER_OF_FOODS_IN_CONTINUOUS_PLAY_GAME; i++ )
			foodPlanter.plant();

		return GAME_READY_STATE;
	};

	this.createStartSnake = function(board) {
		return this.defaultStartSnake(createSnake, board);
	}

	this.update = function(result) {
		switch(result) {
			case SNAKE_DIED:
				return GAME_OVER_STATE;

			case SNAKE_ATE:
				this.score ++;
				foodPlanter.plant();
				return GAME_RUNNING_STATE;

			case SNAKE_MOVED:
				return GAME_RUNNING_STATE;

			default:
				throw new Error("Unknown state");
		}
	};

	this.gameWon = function(){
		throw new Error("Continuous game only ends on game over");
	};

	this.gameLost = function(){
		return `*** You scored: ${this.score} points ***`;
	};
}
ContinuousPlayRuleSet.prototype = new RuleSetPrototype();

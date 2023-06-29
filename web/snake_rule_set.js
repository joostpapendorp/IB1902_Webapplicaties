"use strict";

const INITIAL_DIRECTION = UP;
const NUMBER_OF_FOODS_PER_BASIC_GAME = 5;

const NEW_GAME_STATE = createGameState("New game");
const GAME_RUNNING_STATE = createGameState("Game running");
const GAME_OVER_STATE = createGameState("Game over");
const GAME_WON_STATE = createGameState("Game won");

const GAME_RESULT_WIN = {result:"win"};
const GAME_RESULT_LOSS = {result:"loss"};

function ruleSets(createSnake, foodPlanter) {

	function BasicRuleSet(createSnake, foodPlanter, highScores){
		this.createSnake = createSnake;
		this.foodPlanter = foodPlanter;
		this.highScores = highScores;
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


	/**
		@function createStartSnake() -> Snake
		@desc Slang creëren, bestaande uit  twee segmenten, in het midden van het veld
		@return: slang volgens specificaties
	*/
	this.createStartSnake = function(board) {
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

	function basic(highScores) {
		let ruleSet = new BasicRuleSet(createSnake, foodPlanter, highScores);

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
		basic : (storage) => basic(storage)
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

function difficulties(ruleSets){
	function Difficulty(name, description, ruleSet){
		this.name = name;
		this.description = description;
		this.ruleSet = ruleSet;
	}

	let basic = new Difficulty(
		"Basic",
		"Eat all the food to win.",
		(storage) => ruleSets.basic(storage.requestStorage("Basic"))
	);
	Object.freeze(basic);
	return [basic];
}

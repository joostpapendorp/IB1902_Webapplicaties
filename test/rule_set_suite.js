import {
	INITIAL_DIRECTION,
	NUMBER_OF_FOODS_PER_BASIC_GAME, NUMBER_OF_FOODS_IN_CONTINUOUS_PLAY_GAME,

	GAME_RESULT_WIN,
	GAME_RESULT_LOSS,

	ruleSets,
	difficulties
} from "../web/snake_rule_set.js"
import {createLocation} from "../web/snake_location.js";
import {
	SNAKE_MOVED,
	SNAKE_DIED,
	SNAKE_ATE
} from "../web/snake_snake.js"
import {
	GAME_READY_STATE,
	GAME_RUNNING_STATE,
	GAME_WON_STATE,
	GAME_OVER_STATE
} from "../web/snake_engine.js"

import {iterateReturnValuesOver, MockFactory, Recorder, Invocation} from "./mocks.js";
import {MockBoard} from "./board_suite.js";
import {MockSnake} from "./snake_suite.js";
import {MockFood} from "./food_suite.js";
import {MockSnakeStorage, MockSnakeStore} from "./storage_suite.js";
import {MOVE_UP} from "../web/snake_player.js";

"use strict";

const NUMBER_OF_RULE_SETS = 2;

export function buildMockRuleSet(){
	return new MockRuleSetBuilder();
}

function MockRuleSetBuilder(){
	this.stateToReturn = GAME_RUNNING_STATE;
	this.initialDirection = MOVE_UP;
	this.tallyText = "MOCK_TALLY_TEXT";

	this.withStateToReturn = function(state){
		this.stateToReturn = state;
		return this;
	};

	this.withInitialDirection = function(direction){
		this.initialDirection = direction;
		return this;
	};

	this.withTallyText = function(text){
		this.tallyText = text;
		return this;
	};

	this.build = function(){
		return new MockRuleSet(this.stateToReturn, this.initialDirection, this.tallyText);
	};
}

function MockRuleSet(stateToReturn, initialDirection, tallyText){
	this.recorders = {
		prepare : new Recorder("prepare"),
		initialDirection : new Recorder("initialDirection"),
		createStartSnake : new Recorder("createStartSnake"),
		start : new Recorder("start"),
		update : new Recorder("update"),
		gameWon : new Recorder("gameWon"),
		gameLost : new Recorder("gameLost"),
	};

	this.stateToReturn = GAME_READY_STATE;
	this.tallyText = "MOCK_TALLY_TEXT";
	this.initialDirection = MOVE_UP;

	this.prepare = function(){
		this.recorders.prepare.invoked();
		return GAME_READY_STATE;
	};

	this.initialDirection = function(){
		this.recorders.initialDirection.invoked();
		return stateToReturn;
	};

	this.createStartSnake = function(board){
		this.recorders.createStartSnake.invokedWith([board]);
		return new MockSnake();
	}

	this.start = function(){
		this.recorders.start.invoked();
		return GAME_RUNNING_STATE;
	};

	this.update = function(result){
		this.recorders.update.invokedWith([result]);
		return stateToReturn;
	};

	this.gameWon = function(){
		this.recorders.gameWon.invoked();
		return tallyText;
	};

	this.gameLost = function(){
		this.recorders.gameLost.invoked();
		return tallyText;
	};
}

export function buildRules() {
	return new RuleSetBuilder();
}

function RuleSetBuilder(){
	this.snakeFactory = (locations) => new MockSnake();
	this.foodPlanter = new MockFood();
	this.highScores = new MockSnakeStore();

	this.basic = function(){
		return ruleSets(
			this.snakeFactory,
			this.foodPlanter
		).basic(this.highScores);
	};

	this.continuousPlay = function(){
		return ruleSets(
			this.snakeFactory,
			this.foodPlanter
		).continuousPlay(this.highScores);
	};

	this.withSnakeFactory = function(snakeFactory){
		this.snakeFactory = snakeFactory;
		return this;
	};

	this.withFoodPlanter = function(foodPlanter){
		this.foodPlanter = foodPlanter;
		return this;
	};

	this.withHighScores = function(highScores){
		this.highScores = highScores;
		return this;
	};
}

function forAllRuleSets(test) {
	[
		(builder)=>builder.basic(),
		(builder)=>builder.continuousPlay()
	].forEach(subjectBuilder => test(subjectBuilder));
}


QUnit.module("Rule Set");

QUnit.test("Constant values",
	assert => {
		assert.expect(5);

		assert.equal(INITIAL_DIRECTION, MOVE_UP, "Snake initial direction is up");
		assert.equal(NUMBER_OF_FOODS_PER_BASIC_GAME, 5, "Basic game places 5 units of food");
		assert.equal(NUMBER_OF_FOODS_IN_CONTINUOUS_PLAY_GAME, 2, "Continuous game keeps 2 units of food on the board");

		assert.propEqual(GAME_RESULT_WIN, {result:"win"}, "The result of a won game");
		assert.propEqual(GAME_RESULT_LOSS, {result:"loss"}, "The result of a lost game");
	}
);

QUnit.test("Rule set provides the initial direction",
	assert => {
		assert.expect(NUMBER_OF_RULE_SETS);

		forAllRuleSets( subjectFrom => {
			let subject = subjectFrom(buildRules());

			assert.equal(subject.initialDirection(), INITIAL_DIRECTION, "provides the constant as initial direction");
		});
	}
);

QUnit.test("Starting snake is two segments long, placed left of the center, facing up",
	assert => {
		assert.expect(NUMBER_OF_RULE_SETS * 2);

		forAllRuleSets( subjectFrom => {
			let mockBoard = new MockBoard()
			let mockSnakeFactory = new MockFactory("Snake");
			let expectedLocations = [
				createLocation(8, 9),
				createLocation(8, 8)
			];

			let subject = subjectFrom(
				buildRules().
				withSnakeFactory(mockSnakeFactory.dyadic())
			);

			subject.createStartSnake(mockBoard);

			let recorder = mockSnakeFactory.recorders.build
			assert.equal(recorder.timesInvoked(), 1, "One snake is created");

			assert.propEqual(
				recorder.invocations[0],
				new Invocation([mockBoard,expectedLocations]),
				"Snake is located left of the center, facing up"
			);
		});
	}
);


QUnit.test("Preparing initializes the game.",
	assert => {
		assert.expect(NUMBER_OF_RULE_SETS);

		forAllRuleSets( subjectFrom => {
			let subject = subjectFrom(buildRules());

			assert.equal(subject.prepare(), GAME_READY_STATE, "Preparing yields the new game state");
		});
	}
);


QUnit.test("Starting the game result in it running",
	assert => {
		assert.expect(NUMBER_OF_RULE_SETS);

		forAllRuleSets( subjectFrom => {
			let subject = subjectFrom(buildRules());
			subject.prepare();

			assert.equal(subject.start(), GAME_RUNNING_STATE, "Starting yields the game running state");
		});
	}
);


QUnit.test("Moving the snake continues the game",
	assert => {
		assert.expect(NUMBER_OF_RULE_SETS);

		forAllRuleSets( subjectFrom => {
			let subject = subjectFrom(buildRules());

			subject.prepare();
			subject.start();

			assert.equal(subject.update(SNAKE_MOVED), GAME_RUNNING_STATE, "Updating with a moved snake yields the game running state");
		});
	}
);


QUnit.test("Killing the snake loses the game",
	assert => {
		assert.expect(NUMBER_OF_RULE_SETS);

		forAllRuleSets( subjectFrom => {
			let subject = subjectFrom(buildRules());

			subject.prepare();
			subject.start();

			assert.equal(subject.update(SNAKE_DIED), GAME_OVER_STATE, "Updating with a dead snake yields the game over state");
		});
	}
);


QUnit.test("In a basic game, eating food while food remains continues the game and eating all the food wins the game.",
	assert => {
		assert.expect(NUMBER_OF_FOODS_PER_BASIC_GAME);

		let subject = buildRules().basic();
		subject.prepare();
		subject.start();

		for(let i = 0; i< NUMBER_OF_FOODS_PER_BASIC_GAME - 1; i++)
			assert.equal(subject.update(SNAKE_ATE), GAME_RUNNING_STATE, "Eating food yields game running state");

		assert.equal(subject.update(SNAKE_ATE), GAME_WON_STATE, "Eating the last food yields game won state");
	}
);

QUnit.test("Basic rule set plants a fixed amount of food",
	assert => {
		assert.expect(1);

		let mockFoodPlanter = new MockFood();
		let subject = buildRules().
			withFoodPlanter(mockFoodPlanter).
			basic();

		subject.prepare();

		let plant = mockFoodPlanter.recorders.plant;
		assert.equal(plant.timesInvoked(), NUMBER_OF_FOODS_PER_BASIC_GAME, "Planter is invoked for each piece of food");
	}
);


QUnit.test("Difficulties provides all the rule sets in ascending order of difficulty",
	assert => {
		assert.expect(6);

		let mockBasicRules = new MockFactory("Basic");
		let mockContinuousRules = new MockFactory("Continuous");
		let mockRuleSets = {
			basic: mockBasicRules.niladic(),
			continuousPlay : mockContinuousRules.niladic()
		}

		let subject = difficulties(mockRuleSets);


		let actualBasic = subject[0];
		assert.equal(actualBasic.name, "Basic", "Basic difficulty exists");
		assert.equal(actualBasic.description, "Eat all the food to win.", "Basic difficulty describes");

		let mockBasic = mockBasicRules.recorders.build;
		actualBasic.ruleSet(new MockSnakeStorage());
		assert.equal(mockBasic.timesInvoked(), 1, "Basic difficulty invokes");


		let actualContinuous = subject[1];
		assert.equal(actualContinuous.name, "Continuous Play", "Continuous difficulty exists");
		assert.equal(actualContinuous.description, "Eat as many foods as you can.", "Continuous difficulty describes");

		let mockContinuous = mockContinuousRules.recorders.build;
		actualContinuous.ruleSet(new MockSnakeStorage());
		assert.equal(mockContinuous.timesInvoked(), 1, "Continuous difficulty invokes");
	}
);


QUnit.test("Winning the basic game writes the score.",
	async function(assert) {
		assert.expect(6);

		const WINS = 2, LOSSES = 1;
		let mockHighScores = new MockSnakeStore(iterateReturnValuesOver([WINS, LOSSES]));

		let subject = buildRules().
			withHighScores(mockHighScores).
			basic();

		let actual = await subject.gameWon();

		let add = mockHighScores.recorders.add;
		assert.equal(add.timesInvoked(), 1, "Stores the result");
		let actualScores = add.invocations[0].arguments[0];
		assert.propEqual(actualScores, GAME_RESULT_WIN, "Result should be a win");

		let count = mockHighScores.recorders.count;
		assert.equal(count.timesInvoked(), 2, "counts the wins and the losses");
		assert.equal(count.invocations[0].arguments[0], GAME_RESULT_WIN, "uses correct query to count wins");
		assert.equal(count.invocations[1].arguments[0], GAME_RESULT_LOSS, "uses correct query to count losses");

		assert.equal(actual, "*** Wins: 2 *** Losses: 1 ***", "Tallies wins and losses");
	}
);


QUnit.test("Losing the basic game writes the score.",
	async function(assert) {
		assert.expect(6);

		const WINS = 1, LOSSES = 2;
		let mockHighScores = new MockSnakeStore(iterateReturnValuesOver([WINS, LOSSES]));

		let subject = buildRules().
			withHighScores(mockHighScores).
			basic();

		let actual = await subject.gameLost();

		let add = mockHighScores.recorders.add;
		assert.equal(add.timesInvoked(), 1, "Stores the result");
		let actualScores = add.invocations[0].arguments[0];
		assert.propEqual(actualScores, GAME_RESULT_LOSS, "Result should be a loss");

		let count = mockHighScores.recorders.count;
		assert.equal(count.timesInvoked(), 2, "counts the wins and the losses");
		assert.equal(count.invocations[0].arguments[0], GAME_RESULT_WIN, "uses correct query to count wins");
		assert.equal(count.invocations[1].arguments[0], GAME_RESULT_LOSS, "uses correct query to count losses");

		assert.equal(actual, "*** Wins: 1 *** Losses: 2 ***", "Tallies wins and losses");
	}
);

// TODO storage
QUnit.test("Losing the continuous game writes the score.",
	async function(assert) {
		assert.expect(1);

		let subject = buildRules().
			continuousPlay();

		subject.update(SNAKE_ATE);
		subject.update(SNAKE_ATE);
		subject.update(SNAKE_ATE);

		let actual = subject.gameLost();

		assert.equal(actual, "*** You scored: 3 points ***", "Score equals food eaten");
	}
);

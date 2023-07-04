import {createEngineFactory, CENTRAL_TILE} from "../web/snake_engine.js";
import {
	SNAKE_MOVED,
	SNAKE_DIED,
	SNAKE_ATE
} from "../web/snake_snake.js"
import {
	NUMBER_OF_FOODS_PER_BASIC_GAME,
	GAME_READY_STATE,
	GAME_RUNNING_STATE,
	GAME_OVER_STATE,
	GAME_WON_STATE,
} from "../web/snake_rule_set.js";
import {MOVE_UP, MOVE_LEFT} from "../web/snake_player.js";

import {Recorder} from "./mocks.js";
import {MockBoard} from "./board_suite.js";
import {MockSnake} from "./snake_suite.js";
import {buildRules, buildMockRuleSet} from "./rule_set_suite.js";
import {MockTimer} from "./timer_suite.js";
import {MockSplashScreen} from "./snake_student_suite.js";


"use strict";


export function MockEngine(){
	this.recorders = {
		start : new Recorder("start"),
		tick : new Recorder("tick"),
		steer : new Recorder("tick"),
		shutDown : new Recorder("shut down"),
		togglePause : new Recorder("toggle pause"),
	};

	this.start = function(){
		this.recorders.start.invoked();
	};

	this.tick = function(direction){
		this.recorders.tick.invokedWith([direction]);
	};

	this.steer = function(direction){
		this.recorders.steer.invokedWith([direction]);
	};

	this.shutDown = function(){
		this.recorders.shutDown.invoked();
	};

	this.togglePause = function(){
		this.recorders.togglePause.invoked();
	};
}

QUnit.module("Engine");

function buildEngine() {
	return new EngineBuilder();
}

function EngineBuilder(){
	this.board = new MockBoard();
	this.timer = new MockTimer();
	this.splashScreen = new MockSplashScreen();
	this.rules = buildMockRuleSet().build();

	this.build = function(){
		return createEngineFactory(
			this.board,
			this.timer,
			this.splashScreen
		).prepareEngineWith(this.rules);
	};

	this.withBoard = function(board){
		this.board = board;
		return this;
	};

	this.withTimer = function(timer){
		this.timer = timer;
		return this;
	};

	this.withRules = function(rules){
		this.rules = rules;
		return this;
	};

	this.withSplashScreen = function(splashScreen){
		this.splashScreen = splashScreen;
		return this;
	};
}


QUnit.test("Creating the engine initializes it",
	assert => {
		assert.expect(4);

		let mockBoard = new MockBoard();
		let mockRules = buildMockRuleSet().
			withStateToReturn(GAME_READY_STATE).
			build();

		/*let ignored =*/ buildEngine().
			withBoard(mockBoard).
			withRules(mockRules).
			build();

		let recorders = mockRules.recorders;
		assert.equal(recorders.prepare.timesInvoked(), 1, "Engine prepares the rule set");
		assert.equal(recorders.initialDirection.timesInvoked(), 1, "Engine requests initial direction from the rule set");

		let createStartSnake = recorders.createStartSnake;
		assert.equal(createStartSnake.timesInvoked(), 1, "Engine requests initial direction from the rule set");
		assert.equal(createStartSnake.invocations[0].arguments[0], mockBoard, "Engine passes board to rule set to create snake upon");
	}
);


QUnit.test("Tick pushes the snake and repaints the board",
	assert => {
		assert.expect(3);

		let mockBoard = new MockBoard();
		let mockSnake = new MockSnake(SNAKE_MOVED);
		let rules = buildRules()
	    .withSnakeFactory(() => mockSnake)
	    .basic();

		let subject = buildEngine().
			withBoard(mockBoard).
			withRules(rules).
			build();

		subject.tick();

		let push = mockSnake.recorders.push;
		assert.equal(push.timesInvoked(), 1, "Snake is pushed once.");
		let actual = push.invocations[0].arguments[0];
		assert.equal(actual, MOVE_UP, "Direction is passed on.")

		let redraw = mockBoard.recorders.redraw;
		assert.equal(redraw.timesInvoked(), 1, "Board is redrawn");
	}
);


QUnit.test("Killing the snake stops the timer.",
	assert => {
		assert.expect(1);

		let mockTimer = new MockTimer();
		let mockSnake = new MockSnake(SNAKE_DIED);
		let rules = buildRules()
	    .withSnakeFactory(() => mockSnake)
			.basic()

		let subject = buildEngine().
			withTimer(mockTimer).
			withRules(rules).
			build();

		subject.tick();

		let stopTimer = mockTimer.recorders.stop;
		assert.equal(stopTimer.timesInvoked(), 1, "Killing the snake stops the timer.");
	}
);


QUnit.test("Killing the snake writes the loss.",
	assert => {
		assert.expect(2);

		let mockBoard = new MockBoard();
		let mockSplashScreen = new MockSplashScreen();
		let mockSnake = new MockSnake(SNAKE_DIED);
		let rules = buildRules()
	    .withSnakeFactory(() => mockSnake)
			.basic()

		let subject = buildEngine().
			withBoard(mockBoard).
			withSplashScreen(mockSplashScreen).
			withRules(rules).
			build();

		subject.tick();

		let writeGameOver = mockSplashScreen.recorders.writeGameOver;
		assert.equal(writeGameOver.timesInvoked(), 1, "Killing the snake writes game over.");
		assert.equal(writeGameOver.invocations[0].arguments[0], mockBoard, "splash screen writes on the board")
	}
);


QUnit.test("Winning the game stops the timer.",
	assert => {
		assert.expect(1);

		let mockTimer = new MockTimer();
		let mockSnake = new MockSnake(SNAKE_ATE);
		let rules = buildRules()
	    .withSnakeFactory(() => mockSnake)
			.basic()

		let subject = buildEngine().
			withTimer(mockTimer).
			withRules(rules).
			build();

		for(let i = 0; i < NUMBER_OF_FOODS_PER_BASIC_GAME; i++ )
			subject.tick();

		let stopTimer = mockTimer.recorders.stop;
		assert.equal(stopTimer.timesInvoked(), 1, "Eating the last food stops the timer.");
	}
);


QUnit.test("Winning the game writes the win.",
	assert => {
		assert.expect(2);

		let mockBoard = new MockBoard();
		let mockSplashScreen = new MockSplashScreen();
		let mockSnake = new MockSnake(SNAKE_ATE);
		let rules = buildRules()
	    .withSnakeFactory(() => mockSnake)
			.basic()

		let subject = buildEngine().
			withBoard(mockBoard).
			withSplashScreen(mockSplashScreen).
			withRules(rules).
			build();

		for(let i = 0; i < NUMBER_OF_FOODS_PER_BASIC_GAME; i++ )
			subject.tick();

		let writeGameWon = mockSplashScreen.recorders.writeGameWon;
		assert.equal(writeGameWon.timesInvoked(), 1, "Eating the last food writes you won.");
		assert.equal(writeGameWon.invocations[0].arguments[0], mockBoard, "splash screen writes on the board")
	}
);


QUnit.test("Winning the game reports a win.",
	async function(assert) {
		assert.expect(4);
		let expected = "MOCK_TALLY_WIN_RESULTS";
		let mockRules = buildMockRuleSet().
			withStateToReturn(GAME_WON_STATE).
			withTallyText(expected).
			build();

		let mockBoard = new MockBoard();

		let subject = buildEngine().
			withRules(mockRules).
			withBoard(mockBoard).
			build();

		await subject.tick();

		let gameWon = mockRules.recorders.gameWon;
		assert.equal(gameWon.timesInvoked(), 1, "Uses rules to update wins/losses");

		let writeAt = mockBoard.recorders.writeAt;
		assert.equal(writeAt.timesInvoked(), 1, "Writes text on the board");
		assert.equal(writeAt.invocations[0].arguments[0], CENTRAL_TILE, "Writes in the center")
		assert.equal(writeAt.invocations[0].arguments[1], expected, "Writes the tallied results")
	}
);


QUnit.test("Losing the game reports a loss.",
	async function(assert) {
		assert.expect(4);

		let expected = "MOCK_TALLY_LOSS_RESULTS";
		let mockRules = buildMockRuleSet().
			withStateToReturn(GAME_OVER_STATE).
			withTallyText(expected).
			build();
		let mockBoard = new MockBoard();

		let subject = buildEngine().
			withRules(mockRules).
			withBoard(mockBoard).
			build();

		await subject.tick();

		let gameLost = mockRules.recorders.gameLost;
		assert.equal(gameLost.timesInvoked(), 1, "Uses rules to update wins/losses");

		let writeAt = mockBoard.recorders.writeAt;
		assert.equal(writeAt.timesInvoked(), 1, "Writes text on the board");
		assert.equal(writeAt.invocations[0].arguments[0], CENTRAL_TILE, "Writes in the center")
		assert.equal(writeAt.invocations[0].arguments[1], expected, "Writes the tallied results")
	}
);


QUnit.test("Starting the engine starts a timer.",
	assert => {
		assert.expect(2);

		let mockTimer = new MockTimer();
		let mockBoard = new MockBoard();
		let mockSnake = new MockSnake(SNAKE_MOVED);
		let rules = buildRules()
	    .withSnakeFactory(() => mockSnake)
			.basic()

		let subject = buildEngine().
			withBoard(mockBoard).
			withTimer(mockTimer).
			withRules(rules).
			build();

		subject.start();

		let startTimer = mockTimer.recorders.start;
		assert.equal(startTimer.timesInvoked(), 1, "Engine starts a timer");

		let push = mockSnake.recorders.push;
		let callBack = startTimer.invocations[0].arguments[0];

		callBack();

		assert.equal(push.timesInvoked(), 1, "Timer calls back to engine.")
	}
);


QUnit.test("Halting the engine stops the timer.",
	assert => {
		assert.expect(1);

		let mockTimer = new MockTimer();

		let subject = buildEngine().
			withTimer(mockTimer).
			build();

		subject.halt();

		let stopTimer = mockTimer.recorders.stop;
		assert.equal(stopTimer.timesInvoked(), 1, "Halting the engine stops the timer.");
	}
);


QUnit.test("Shutting down the engine clears the board.",
	assert => {
		assert.expect(1);

		let mockBoard = new MockBoard();
		let subject = buildEngine().
			withBoard(mockBoard).
			withRules(buildRules().basic()).
			build();

		subject.shutDown();

		let recorder = mockBoard.recorders.clear;
		assert.equal(recorder.timesInvoked(), 1, "Invoked clear");
	}
);


QUnit.test("Shutting down the engine while running stops the timer.",
	assert => {
		assert.expect(1);

		let mockTimer = new MockTimer();
		let rules = buildRules()
	    .withSnakeFactory(() => new MockSnake(SNAKE_MOVED))
			.basic()

		let subject = buildEngine().
			withRules(rules).
			withTimer(mockTimer).
			build();

		subject.start();
		subject.shutDown();

		let recorder = mockTimer.recorders.stop;
		assert.equal(recorder.timesInvoked(), 1, "Timer was stopped.");
	}
);


QUnit.test("Shutting down the engine while not running doesn't try to stop the timer.",
	assert => {
		assert.expect(1);

		let mockTimer = new MockTimer();
		let rules = buildRules()
	    .withSnakeFactory(() => new MockSnake(SNAKE_MOVED))
			.basic()

		let subject = buildEngine().
			withRules(rules).
			withTimer(mockTimer).
			build();

		subject.shutDown();

		let recorder = mockTimer.recorders.stop;
		assert.equal(recorder.timesInvoked(), 0, "Timer was stopped.");
	}
);


QUnit.test("Steering a snake starts moving the snake in the provided direction.",
	assert => {
		assert.expect(2);

		let mockSnake = new MockSnake(SNAKE_MOVED);
		let rules = buildRules()
	    .withSnakeFactory(() => mockSnake)
			.basic()

		let subject = buildEngine().
			withRules(rules).
			build();

		subject.steer(MOVE_LEFT);
		subject.tick();

		let push = mockSnake.recorders.push;
		assert.equal(push.timesInvoked(),1,"Tick pushes snake")
		let actual = push.invocations[0].arguments[0];
		assert.equal(actual, MOVE_LEFT, "Snake is pushed in the steered direction")
	}
);


QUnit.test("toggling pause on the engine twice stops the timer, then starts it.",
	assert => {
		assert.expect(6);

		let mockTimer = new MockTimer();
		let startTimer = mockTimer.recorders.start;
		let stopTimer = mockTimer.recorders.stop;

		let subject = buildEngine().
			withTimer(mockTimer).
			build();

		subject.start();
		assert.equal(startTimer.timesInvoked(), 1, "Starting the engine starts the timer.");
		assert.equal(stopTimer.timesInvoked(), 0, "A running engine does not stop the timer.");

		subject.togglePause();
		assert.equal(stopTimer.timesInvoked(), 1, "Pausing the engine stops the timer.");
		assert.equal(startTimer.timesInvoked(), 1, "Pausing the engine does not restart the timer.");

		subject.togglePause();
		assert.equal(startTimer.timesInvoked(), 2, "Unpausing the engine restarts the timer.");
		assert.equal(stopTimer.timesInvoked(), 1, "Unpausing the engine does not stop the timer again.");
	}
);


QUnit.test("Toggling pause on the engine writes *** Game Paused *** on the center of the board.",
	assert => {
		assert.expect(3);

		let mockBoard = new MockBoard();

		let subject = buildEngine().
			withBoard(mockBoard).
			build();

		subject.start();
		subject.togglePause();

		let writeAt = mockBoard.recorders.writeAt;
		assert.equal(writeAt.timesInvoked(), 1, "Engine writes on the board on pause");
		assert.equal(writeAt.invocations[0].arguments[0], CENTRAL_TILE, "Writes in the center");
		assert.equal(writeAt.invocations[0].arguments[1], "*** GAME PAUSED ***", "Writes the tallied results")
	}
);


QUnit.test("Halting the engine while paused does not stop the timer.",
	assert => {
		assert.expect(6);

		let mockTimer = new MockTimer();
		let startTimer = mockTimer.recorders.start;
		let stopTimer = mockTimer.recorders.stop;

		let subject = buildEngine().
			withTimer(mockTimer).
			build();

		subject.start();
		assert.equal(startTimer.timesInvoked(), 1, "Starting the engine starts the timer.");
		assert.equal(stopTimer.timesInvoked(), 0, "A running engine does not stop the timer.");

		subject.togglePause();
		assert.equal(stopTimer.timesInvoked(), 1, "Pausing the engine stops the timer.");
		assert.equal(startTimer.timesInvoked(), 1, "Pausing the engine does not restart the timer.");

		subject.halt();
		assert.equal(stopTimer.timesInvoked(), 1, "Halting the engine while paused does not stop the game.");
		assert.equal(startTimer.timesInvoked(), 1, "Halting the engine never starts the timer.");
	}
);


QUnit.test("Pausing the engine stops command processing and prevents stray timer calls.",
	assert => {
		assert.expect(2);

		let mockSnake = new MockSnake(SNAKE_MOVED);
		let rules = buildRules()
	    .withSnakeFactory(() => mockSnake)
			.basic()

		let subject = buildEngine().
			withRules(rules).
			build();

		subject.start();
		subject.togglePause();
		subject.steer(MOVE_LEFT);
		subject.tick();
		subject.togglePause();
		subject.tick();

		let push = mockSnake.recorders.push;
		assert.equal(push.timesInvoked(), 1, "Engine does not execute ticks while paused.");
		assert.equal(push.invocations[0].arguments[0], MOVE_UP, "Engine does not process steering while paused.");
	}
);

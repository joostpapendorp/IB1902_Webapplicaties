import {createGame} from "../web/snake_game.js";
import {createPlayer,
	UP_ARROW_KEY_CODE, SPACE_BAR_KEY_CODE, NUMBER_1_KEY_CODE, NUMBER_2_KEY_CODE,
	MOVE_UP,
	PAUSE_COMMAND} from "../web/snake_player.js";
import {MockEngine} from "./engine_suite.js";

import {iterateReturnValuesOver, MockFactory} from "./mocks.js";
import {buildMockRuleSet, MockDifficulty} from "./rule_set_suite.js";
import {MockSnakeStorage} from "./storage_suite.js";
import {MockPlayer} from "./player_suite.js";

"use strict";

QUnit.module("Game");

function buildGame() {
	return new GameBuilder();
}

function GameBuilder(){
	this.difficulties = [{
		name:"MOCK_DIFFICULTY",
		description:"MOCK_DESCRIPTION",
		ruleSet: (storage) => buildMockRuleSet().build()
	}];
	this.engineFactory = (board, timer) => new MockEngine();
	this.player = createPlayer();
	this.storage = new MockSnakeStorage();
	this.splashScreen = ()=>{};

	this.build = function(){
		return createGame(
			this.difficulties,
			this.engineFactory,
			this.player,
			this.storage,
			this.splashScreen
		);
	};

	this.withRuleSet = function(ruleSet){
		this.difficulties = [{
			name:"MOCK_DIFFICULTY",
			description:"MOCK_DESCRIPTION",
			ruleSet: (storage) => ruleSet
		}];
		return this;
	};

	this.withEngineFactory = function(engineFactory){
		this.engineFactory = engineFactory;
		return this;
	};

	this.withPlayer = function(player){
		this.player = player;
		return this;
	};

	this.withStorage = function(storage){
		this.storage = storage;
		return this;
	};

	this.withSplashScreen = function(splashScreen){
		this.splashScreen = splashScreen;
		return this;
	};

	this.withDifficulties = function(difficulties){
		this.difficulties = difficulties;
		return this;
	};
}


QUnit.test("Starting the app shows the splash screen.",
	assert => {
		assert.expect(1);

		// (ab)use factory to mock an anonymous function
		let mockSplashScreen = new MockFactory("SplashScreen");

		let subject = buildGame().
			withSplashScreen(mockSplashScreen.niladic()).
			build();

		subject.start();

		assert.equal(mockSplashScreen.recorders.build.timesInvoked(), 1, "Splash screen is shown");
	}
);


QUnit.test("Starting a game creates the engine with the chosen rules.",
	assert => {
		assert.expect(8);

		let firstMockRuleSet = buildMockRuleSet().build();
		let firstMockDifficulty = new MockDifficulty(firstMockRuleSet);

		let secondMockRuleSet = buildMockRuleSet().build();
		let secondMockDifficulty = new MockDifficulty(secondMockRuleSet);

		let mockDifficulties = [firstMockDifficulty, secondMockDifficulty];

		for( const [code, difficulty, expectedRuleSet] of [
			[NUMBER_1_KEY_CODE, firstMockDifficulty, firstMockRuleSet],
			[NUMBER_2_KEY_CODE, secondMockDifficulty, secondMockRuleSet]
		]){
			let mockEngineFactory = new MockFactory("Engine")
			let mockEngine = new MockEngine();

			let subject = buildGame().
				withDifficulties(mockDifficulties).
				withPlayer(createPlayer()).
				withEngineFactory(mockEngineFactory.monadic(mockEngine)).
				build();

			subject.start();
			subject.receiveKeyInput(code);

			let ruleSet = difficulty.recorders.ruleSet;
			assert.equal(ruleSet.timesInvoked(), 1, "Game uses the correct difficulty to acquire the rule set");

			let build = mockEngineFactory.recorders.build;
			assert.equal(build.timesInvoked(), 1, "Game creates the engine");

			let actualArguments = build.invocations[0].arguments;
			assert.equal(actualArguments[0], expectedRuleSet, "Game passes the rules to the engine");

			let start = mockEngine.recorders.start;
			assert.equal(start.timesInvoked(), 1, "Game starts the engine");
		}
	}
);


QUnit.test("Stopping the app while it has started but isn't running a game does nothing with the engine.",
	assert => {
		assert.expect(1);

		let mockEngine = new MockEngine();
		let subject = buildGame().
			withEngineFactory((rules)=>mockEngine).
			withPlayer(createPlayer()).
			build();

		subject.start();
		subject.stop();

		let recorder = mockEngine.recorders.shutDown;
		assert.equal(recorder.timesInvoked(), 0, "Engine is not shut down.");
	}
);


QUnit.test("Stopping the app while a game is running shuts the engine down.",
	assert => {
		assert.expect(1);

		let mockEngine = new MockEngine();
		let subject = buildGame().
			withEngineFactory((rules)=>mockEngine).
			withPlayer(createPlayer()).
			build();

		subject.start();
		subject.receiveKeyInput(NUMBER_1_KEY_CODE);
		subject.stop();

		let recorder = mockEngine.recorders.shutDown;
		assert.equal(recorder.timesInvoked(), 1, "Invoked shut down");
	}
);


QUnit.test("Starting the app while a game is running shuts the engine down.",
	assert => {
		assert.expect(5);

		let mockEngine = new MockEngine();
		let mockEngineFactory = new MockFactory("Engine")

		let subject = buildGame().
			withEngineFactory(mockEngineFactory.monadic(mockEngine)).
			build();

		subject.start();
		let build = mockEngineFactory.recorders.build;
		assert.equal(build.timesInvoked(), 0, "Engine isn't built until game start.");

		subject.receiveKeyInput(NUMBER_1_KEY_CODE);
		assert.equal(build.timesInvoked(), 1, "Engine is built on game start.");
		assert.equal(mockEngine.recorders.start.timesInvoked(), 1, "Game starts the engine once");

		subject.start();
		assert.equal(mockEngine.recorders.shutDown.timesInvoked(), 1, "Game stops the engine once");
		assert.equal(build.timesInvoked(), 1, "Engine isn't rebuilt on app restart.");
	}
);


QUnit.test("Stopping a stopped game does not shuts the engine down a second time.",
	assert => {
		assert.expect(1);

		let mockEngine = new MockEngine();
		let subject = buildGame().
			withEngineFactory((rules)=>mockEngine).
			withPlayer(createPlayer()).
			build();

		subject.start();
		subject.receiveKeyInput(NUMBER_1_KEY_CODE);

		subject.stop();
		subject.stop();

		let recorder = mockEngine.recorders.shutDown;
		assert.equal(recorder.timesInvoked(), 1, "Invoked shut down");
	}
);


QUnit.test("Receiving arrow key input translates the key code into a direction to steer the engine.",
	assert => {
		assert.expect(2);

		let mockEngine = new MockEngine();

		let subject = buildGame().
      withEngineFactory((rules)=>mockEngine).
      withPlayer(createPlayer()).
      build();

		subject.start();
		subject.receiveKeyInput(NUMBER_1_KEY_CODE);

		subject.receiveKeyInput(UP_ARROW_KEY_CODE);

		let steer = mockEngine.recorders.steer;
		assert.equal(steer.timesInvoked(), 1, "receiving arrow key input steers the engine");

		let actual = steer.invocations[0].arguments[0];
		assert.equal(actual, MOVE_UP, "valid input is translated into corresponding direction")
	}
);


QUnit.test("Receiving space bar key input causes the game to toggle the engine to pause/unpause.",
	assert => {
		assert.expect(1);

		let mockEngine = new MockEngine();

		let subject = buildGame().
      withEngineFactory((rules)=>mockEngine).
      withPlayer(createPlayer()).
      build();

		subject.start();
		subject.receiveKeyInput(NUMBER_1_KEY_CODE);

		subject.receiveKeyInput(SPACE_BAR_KEY_CODE);

		let steer = mockEngine.recorders.togglePause;
		assert.equal(steer.timesInvoked(), 1, "receiving space bar input pauses the engine");
	}
);


QUnit.test("Game filters invalid key inputs.",
	assert => {
		assert.expect(1);

		const INVALID_KEY_CODE = -1;

		let mockEngine = new MockEngine();

		let subject = buildGame().
      withEngineFactory((rules)=>mockEngine).
      withPlayer(createPlayer()).
      build();

		subject.start();
		subject.receiveKeyInput(INVALID_KEY_CODE);

		let steer = mockEngine.recorders.steer;
		assert.equal(steer.timesInvoked(), 0, "Invalid input is filtered out");
	}
);


QUnit.test("Game only processes pause and steer commands when the app is running a game.",
	assert => {
		assert.expect(2);

		let mockEngine = new MockEngine();

		let subject = buildGame().
      withEngineFactory((rules)=>mockEngine).
      withPlayer(createPlayer()).
      build();

		// ignored while app is stopped
		subject.receiveKeyInput(SPACE_BAR_KEY_CODE);
		subject.receiveKeyInput(UP_ARROW_KEY_CODE);

		subject.start();
		// ignored while app is idle
		subject.receiveKeyInput(SPACE_BAR_KEY_CODE);
		subject.receiveKeyInput(UP_ARROW_KEY_CODE);

		subject.receiveKeyInput(NUMBER_1_KEY_CODE);
		// processed while app is running a game
		subject.receiveKeyInput(SPACE_BAR_KEY_CODE);
		subject.receiveKeyInput(UP_ARROW_KEY_CODE);

		subject.stop();

		// again ignored while app is stopped
		subject.receiveKeyInput(SPACE_BAR_KEY_CODE);
		subject.receiveKeyInput(UP_ARROW_KEY_CODE);

		let recorders = mockEngine.recorders;
		assert.equal(recorders.togglePause.timesInvoked(), 1, "engine is only paused while app is running a game");
		assert.equal(recorders.steer.timesInvoked(), 1, "engine is only steered while app is running a game");
	}
);


QUnit.test("App only process START_NEW_GAME commands while the app is idle.",
	assert => {
		assert.expect(2);

		let mockEngine = new MockEngine();
		let mockEngineFactory = new MockFactory("MockEngineFactory");

		let subject = buildGame().
      withEngineFactory(mockEngineFactory.monadic(mockEngine)).
      withPlayer(createPlayer()).
      build();

		// ignored while app is stopped
		subject.receiveKeyInput(NUMBER_1_KEY_CODE);

		subject.start();
		// processed while app is idle
		subject.receiveKeyInput(NUMBER_1_KEY_CODE);

		// ignored while app is running a game
		subject.receiveKeyInput(NUMBER_1_KEY_CODE);

		subject.stop();

		// again ignored while app is stopped
		subject.receiveKeyInput(NUMBER_1_KEY_CODE);

		assert.equal(mockEngineFactory.recorders.build.timesInvoked(), 1, "Engine is only created while app is idle");
		assert.equal(mockEngine.recorders.start.timesInvoked(), 1, "Engine is only started while app is idle");
	}
);


QUnit.test("Game doesn't start a new game until the start command is received.",
	assert => {
		assert.expect(2);

		let mockEngine = new MockEngine();
		let mockEngineFactory = new MockFactory("EngineFactory");

		let subject = buildGame().
      withEngineFactory(mockEngineFactory.monadic(mockEngine)).
      withPlayer(createPlayer()).
      build();

		subject.start();

		let build = mockEngineFactory.recorders.build;
		assert.equal(build.timesInvoked(), 0, "engine isn't created until game start");

		subject.receiveKeyInput(NUMBER_1_KEY_CODE);
		assert.equal(build.timesInvoked(), 1, "starting a new game creates a new engine");
	}
);

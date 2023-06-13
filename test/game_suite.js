"use strict";

QUnit.module("Game");

function buildGame() {
	return new GameBuilder();
}

function GameBuilder(){
	this.difficulty = new MockRuleSet();
	this.engineFactory = (board, timer) => new MockEngine();
	this.player = createPlayer();

	this.build = function(){
		return createGame(
			this.difficulty,
			this.engineFactory,
			this.player
		);
	};

	this.withDifficulty = function(difficulty){
		this.difficulty = difficulty;
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
}


QUnit.test("Starting a game creates the engine with the basic rules.",
	assert => {
		assert.expect(3);

		let mockRuleSet = new MockRuleSet();
		let mockEngineFactory = new MockFactory("Engine")
		let mockEngine = new MockEngine();

		let subject = buildGame().
			withDifficulty(mockRuleSet).
			withEngineFactory(mockEngineFactory.monadic(mockEngine)).
			build();

		subject.start();

		let build = mockEngineFactory.recorders.build;
		assert.equal(build.timesInvoked(), 1, "Game creates the engine");

		let actualArguments = build.invocations[0].arguments;
		assert.equal(actualArguments[0], mockRuleSet, "Game passes the rules to the engine");

		let start = mockEngine.recorders.start;
		assert.equal(start.timesInvoked(),1,"Game starts the engine");
	}
);


QUnit.test("Stopping a game shuts the engine down.",
	assert => {
		assert.expect(1);

		let mockEngine = new MockEngine();
		let subject = buildGame().
			withEngineFactory((rules)=>mockEngine).
			build();

		subject.start();
		subject.stop();

		let recorder = mockEngine.recorders.shutDown;
		assert.equal(recorder.timesInvoked(), 1, "Invoked shut down");
	}
);


QUnit.test("Starting a game while the engine is running first shuts the engine down, then starts a new engine.",
	assert => {
		assert.expect(4);

		let firstEngine = new MockEngine();
		let secondEngine = new MockEngine();
		let mockEngineFactory = new MockFactory("Engine")

		let subject = buildGame().
			withEngineFactory(
				mockEngineFactory.recordingFrom( recorder => {
					let iteration = iterateReturnValuesOver([firstEngine, secondEngine]);
					return (rules) => {
						recorder.invokedWith([rules])
						return iteration(rules);
					};
				})
			).
			build();

		subject.start();
		subject.start();

		let firstRecorders = firstEngine.recorders;
		assert.equal(firstRecorders.start.timesInvoked(),1,"Game starts the first engine once");
		assert.equal(firstRecorders.shutDown.timesInvoked(),1,"Game stops the first engine once");

		let secondRecorders = secondEngine.recorders;
		assert.equal(secondRecorders.start.timesInvoked(),1,"Game starts the second engine once");
		assert.equal(secondRecorders.shutDown.timesInvoked(),0,"Game does not stops the second engine yet");
	}
);


QUnit.test("Stopping a stopped game does not shuts the engine down a second time.",
	assert => {
		assert.expect(1);

		let mockEngine = new MockEngine();
		let subject = buildGame().
			withEngineFactory((rules)=>mockEngine).
			build();

		subject.start();
		subject.stop();
		subject.stop();

		let recorder = mockEngine.recorders.shutDown;
		assert.equal(recorder.timesInvoked(), 1, "Invoked shut down");
	}
);


QUnit.test("Receiving key input translates the key code into a direction to steer the engine.",
	assert => {
		assert.expect(2);

		let mockEngine = new MockEngine();

		let subject = buildGame().
      withEngineFactory((rules)=>mockEngine).
      withPlayer(createPlayer()).
      build();

		subject.start();
		subject.receiveKeyInput(UP_ARROW_KEY_CODE);

		let steer = mockEngine.recorders.steer;
		assert.equal(steer.timesInvoked(), 1, "receiving valid input steers the engine");

		let actual = steer.invocations[0].arguments[0];
		assert.equal(actual, UP, "valid input is translated into corresponding direction")
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

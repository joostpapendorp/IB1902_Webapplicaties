"use strict";

QUnit.module("Game");

function GameBuilder(){
	this.snakeFactory = (locations) => new MockSnake();
	this.engineFactory = (board, timer) => new MockEngine();
	this.player = createPlayer();

	this.build = function(){
		return createGame(
			this.snakeFactory,
			this.engineFactory,
			this.player
		);
	};

	this.withSnakeFactory = function(snakeFactory){
		this.snakeFactory = snakeFactory;
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


QUnit.test("Starting snake is two segments long, placed left of the center, facing up",
	assert => {
		assert.expect(2);

		let mockSnakeFactory = new MockFactory("Snake");
		let expectedLocations = [
			createLocation(8, 9),
			createLocation(8, 8)
		];

		let subject = new GameBuilder().
		  withSnakeFactory(mockSnakeFactory.monadic()).
		  build();

		subject.start();

		let recorder = mockSnakeFactory.recorders.build
		assert.equal(recorder.timesInvoked(), 1, "One snake is created");

		assert.propEqual(
			recorder.invocations[0],
			new Invocation([expectedLocations]),
			"Snake is located left of the center, facing up"
		);
	}
);


QUnit.test("Starting a game creates the engine with initial snake moving upwards.",
	assert => {
		assert.expect(4);

		let mockEngineFactory = new MockFactory("Engine")
		let mockSnake = new MockSnake();
		let mockEngine = new MockEngine();

		let subject = new GameBuilder().
			withSnakeFactory((locations) => mockSnake).
			withEngineFactory(mockEngineFactory.dyadic(mockEngine)).
			build();

		subject.start();

		let build = mockEngineFactory.recorders.build;
		assert.equal(build.timesInvoked(), 1, "Game creates the engine");

		let actualArguments = build.invocations[0].arguments;
		assert.equal(actualArguments[0], mockSnake, "Game passes the starting snake it built to the engine");
		assert.equal(actualArguments[1], UP, "Snake starts moving upwards.");

		let start = mockEngine.recorders.start;
		assert.equal(start.timesInvoked(),1,"Game starts the engine");
	}
);


QUnit.test("Stopping a game shuts the engine down.",
	assert => {
		assert.expect(1);

		let mockEngine = new MockEngine();
		let subject = new GameBuilder().
			withEngineFactory((snake, direction)=>mockEngine).
			build();

		subject.start();
		subject.stop();

		let recorder = mockEngine.recorders.shutDown;
		assert.equal(recorder.timesInvoked(), 1, "Invoked shut down");
	}
);


QUnit.test("Receiving key input translates the key code into a direction to steer the engine.",
	assert => {
		assert.expect(2);

		let mockEngine = new MockEngine();

		let subject = new GameBuilder().
      withEngineFactory((snake, direction)=>mockEngine).
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

		let subject = new GameBuilder().
      withEngineFactory((snake, direction)=>mockEngine).
      withPlayer(createPlayer()).
      build();

		subject.start();
		subject.receiveKeyInput(INVALID_KEY_CODE);

		let steer = mockEngine.recorders.steer;
		assert.equal(steer.timesInvoked(), 0, "Invalid input is filtered out");
	}
);

"use strict";

QUnit.module("Game");

function GameBuilder(){
	this.board = new MockBoard();
	this.snakeFactory = () => new MockSnake();
	this.engineFactory = () => new MockEngine();
	this.timer = new MockTimer();

	this.build = function(){
		return createGame(
			this.board,
			this.snakeFactory,
			this.engineFactory,
			this.timer
		);
	};

	this.withBoard = function(board){
		this.board = board;
		return this;
	};

	this.withSnakeFactory = function(snakeFactory){
		this.snakeFactory = snakeFactory;
		return this;
	};

	this.withEngineFactory = function(engineFactory){
		this.engineFactory = engineFactory;
		return this;
	};

	this.withTimer = function(timer){
		this.timer = timer;
		return this;
	};
}


QUnit.test("Starting snake is two segments long, placed in left of the center, facing up",
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


QUnit.test("Starting a game starts a timer.",
	assert => {
		assert.expect(2);

		let mockTimer = new MockTimer();
		let mockEngine = new MockEngine();

		let subject = new GameBuilder().
			withEngineFactory(() => mockEngine).
			withTimer(mockTimer).
			build();


		subject.start();


		let startTimer = mockTimer.recorders.start;
		assert.equal(startTimer.timesInvoked(), 1, "Game starts a timer");


		let tick = mockEngine.recorders.tick;
		let callBack = startTimer.invocations[0].arguments[0];

		callBack();

		assert.equal(tick.timesInvoked(), 1, "Timer calls back to engine.")
	}
);


QUnit.test("Starting a game starts the engine.",
	assert => {
		assert.expect(3);

		let mockEngineFactory = new MockFactory("Engine");
		let mockBoard = new MockBoard();
		let mockSnake = new MockSnake();

		let subject = new GameBuilder().
			withEngineFactory(mockEngineFactory.dyadic()).
			withBoard(mockBoard).
			withSnakeFactory(()=>mockSnake).
			build();

		subject.start();

		let build = mockEngineFactory.recorders.build;
		assert.equal(build.timesInvoked(), 1, "Game creates the engine");

		let actualArguments = build.invocations[0].arguments;
		assert.equal(actualArguments[0], mockBoard, "Game passes the given board to the engine");
		assert.equal(actualArguments[1], mockSnake, "Game passes the starting snake it built to the engine");
	}
);


QUnit.test("Stopping a game clears the board.",
	assert => {
		assert.expect(1);

		let mockBoard = new MockBoard();
		let subject = new GameBuilder().
			withBoard(mockBoard).
			build();

		subject.stop();

		let recorder = mockBoard.recorders.clear;
		assert.equal(recorder.timesInvoked(), 1, "Invoked clear");
	}
);


QUnit.test("Stopping a game stops the timer.",
	assert => {
		assert.expect(1);

		let mockTimer = new MockTimer();

		let subject = new GameBuilder().
			withTimer(mockTimer).
			build();

		subject.stop();

		let stopTimer = mockTimer.recorders.stop;
		assert.equal(stopTimer.timesInvoked(), 1, "Stopping a game stops the timer");
	}
);

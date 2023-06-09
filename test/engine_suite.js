"use strict";

QUnit.module("Engine");

QUnit.test("Tick pushes the snake and repaints the board",
	assert => {
		assert.expect(3);

		let mockBoard = new MockBoard();

		let factory = createEngineFactory(
			mockBoard,
			new MockTimer()
		);

		let mockSnake = new MockSnake(SNAKE_MOVED);
		let subject = factory.prepareEngineWith(mockSnake, UP);

		subject.tick();

		let push = mockSnake.recorders.push;
		assert.equal(push.timesInvoked(), 1, "Snake is pushed once.");
		let actual = push.invocations[0].arguments[0];
		assert.equal(actual, UP, "Direction is passed on.")

		let redraw = mockBoard.recorders.redraw;
		assert.equal(redraw.timesInvoked(), 1, "Board is redrawn");
	}
);


QUnit.test("Killing the snake stops the timer.",
	assert => {
		assert.expect(1);

		let mockTimer = new MockTimer();

		let factory = createEngineFactory(
			new MockBoard(),
			mockTimer
		);
		let subject = factory.prepareEngineWith(new MockSnake(SNAKE_DIED), UP);

		subject.tick();

		let stopTimer = mockTimer.recorders.stop;
		assert.equal(stopTimer.timesInvoked(), 1, "Killing the snake stops the timer.");
	}
);


QUnit.test("Starting the engine starts a timer.",
	assert => {
		assert.expect(2);

		let mockTimer = new MockTimer();
		let mockBoard = new MockBoard();
		let mockSnake = new MockSnake();

		let factory = createEngineFactory(
			mockBoard,
			mockTimer
		);
		let subject = factory.prepareEngineWith(mockSnake, UP);

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

		let factory = createEngineFactory(
			new MockBoard(),
			mockTimer
		);
		let subject = factory.prepareEngineWith(new MockSnake(), UP);

		subject.halt();

		let stopTimer = mockTimer.recorders.stop;
		assert.equal(stopTimer.timesInvoked(), 1, "Halting the engine stops the timer.");
	}
);


QUnit.test("Shutting down the engine clears the board.",
	assert => {
		assert.expect(1);

		let mockBoard = new MockBoard();
		let factory = createEngineFactory(
			mockBoard,
			new MockTimer()
		);
		let subject = factory.prepareEngineWith(new MockSnake(), UP);

		subject.shutDown();

		let recorder = mockBoard.recorders.clear;
		assert.equal(recorder.timesInvoked(), 1, "Invoked clear");
	}
);


QUnit.test("Steering a snake starts moving the snake in the provided direction.",
	assert => {
		assert.expect(2);

		let mockSnake = new MockSnake();
		let factory = createEngineFactory(new MockBoard(), new MockTimer());
		let subject = factory.prepareEngineWith(mockSnake, UP)

		subject.steer(LEFT);
		subject.tick();

		let push = mockSnake.recorders.push;
		assert.equal(push.timesInvoked(),1,"Tick pushes snake")
		let actual = push.invocations[0].arguments[0];
		assert.equal(actual, LEFT, "Snake is pushed in the steered direction")
	}
);

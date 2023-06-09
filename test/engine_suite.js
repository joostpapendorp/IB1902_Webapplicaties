"use strict";

QUnit.module("Engine");

QUnit.test("Tick moves the snake and repaints the board",
	assert => {
		assert.expect(4);

		let mockSnake = new MockSnake(SNAKE_MOVED);
		let mockBoard = new MockBoard();

		let subject = createEngine(
			mockBoard,
			mockSnake
		);

		let result = subject.tick(DOWN);
		assert.equal(result, SNAKE_MOVED, "Snake moved successfully.")

		let push = mockSnake.recorders.push;
		assert.equal(push.timesInvoked(), 1, "Snake is moved once.");
		let actual = push.invocations[0].arguments[0];
		assert.equal(actual, DOWN, "Direction is passed on.")

		let redraw = mockBoard.recorders.redraw;
		assert.equal(redraw.timesInvoked(), 1, "Board is redrawn");
	}
);

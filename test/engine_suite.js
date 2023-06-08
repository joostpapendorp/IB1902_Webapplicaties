"use strict";

QUnit.module("Engine");

QUnit.test("Tick moves the snake and repaints the board",
	assert => {
		assert.expect(2);

		let mockSnake = new MockSnake();
		let mockBoard = new MockBoard();

		let subject = createEngine(
			mockBoard,
			mockSnake
		);

		subject.tick();

		let move = mockSnake.recorders.move;
		assert.equal(move.timesInvoked(), 1, "Snake is moved once");

		let redraw = mockBoard.recorders.redraw;
		assert.equal(redraw.timesInvoked(), 1, "Board is redrawn");
	}
);

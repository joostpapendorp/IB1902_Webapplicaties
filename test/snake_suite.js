QUnit.module("Snake");

QUnit.test("Constant values",
	assert => {
	  assert.expect(2);

	  assert.equal( SNAKE_HEAD_COLOR, "DarkOrange", "Color of the snake's head is orange" )
	  assert.equal( SNAKE_BODY_COLOR, "DarkRed", "Color of the snake's body is red" )
	}
);

QUnit.test("Starting snake is two segments long, ending in the head",
	assert => {
		assert.expect(3);

		let mockBoard = new MockBoard();

		let subject = createStartSnake(mockBoard);

		let recorder = mockBoard.recorders.createElement
		assert.equal(recorder.timesInvoked(), 2, "Invoked createElement twice");

		let invocations = recorder.invocations;

		assert.propEqual(
			recorder.invocations[0],
			new Invocation([8, 8, "DarkRed"]),
			"The body is created first, at the top left of the center of the board."
		);

		assert.propEqual(
			recorder.invocations[1],
			new Invocation([9, 8, "DarkOrange"]),
			"The head is created last, at the top right of the center of the board."
		);
	}
);

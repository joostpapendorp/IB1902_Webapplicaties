"use strict";

QUnit.module("Snake");

QUnit.test("Constant values",
	assert => {
	  assert.expect(2);

	  assert.equal( SNAKE_HEAD_COLOR, "DarkOrange", "Color of the snake's head is orange" )
	  assert.equal( SNAKE_BODY_COLOR, "DarkRed", "Color of the snake's body is red" )
	}
);

QUnit.test("When a snake is created, it request segments at the indicated positions.",
	assert => {
		assert.expect(4);

		let mockBoard = new MockBoard();
		let expectedLocations = [
			createLocation(0,0),
			createLocation(1,0),
			createLocation(1,1)
		];

		let subject = createSnake(mockBoard,expectedLocations);

		let recorder = mockBoard.recorders.createElement;
		let invocations = recorder.invocations;

		assert.equal(recorder.timesInvoked(), 3, "The snake creates its three segments.");

		assert.propEqual(
			invocations[0].arguments,
			[expectedLocations[0],SNAKE_BODY_COLOR],
			"The first body segment uses the first coordinate given."
		);

		assert.propEqual(
			invocations[1].arguments,
			[expectedLocations[1],SNAKE_BODY_COLOR],
			"The second body segment uses the second coordinate given."
		);

		assert.propEqual(
			invocations[2].arguments,
			[expectedLocations[2],SNAKE_HEAD_COLOR],
			"The last segment is the head and uses the third coordinate given."
		);
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
			new Invocation([createLocation(8, 8), "DarkRed"]),
			"The body is created first, at the top left of the center of the board."
		);

		assert.propEqual(
			recorder.invocations[1],
			new Invocation([createLocation(9, 8), "DarkOrange"]),
			"The head is created last, at the top right of the center of the board."
		);
	}
);

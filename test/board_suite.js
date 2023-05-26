"use strict";

QUnit.module("Board");

QUnit.test("Constant values",
	assert => {
	  assert.expect(1);

	  assert.equal( BOARD_SIZE, 18, "size of the board is 18x18 tiles." );
	}
);

QUnit.test("Tile size is calculated from the smallest canvas dimension",
	assert => {
		assert.expect(2);

		const expectedTileSize = 4;

		let smallestDimension = expectedTileSize * BOARD_SIZE;
		let largestDimension = (expectedTileSize + 2) * BOARD_SIZE;

		let mockCanvas = new MockCanvas();
		mockCanvas.width = () => smallestDimension;
		mockCanvas.height = () => largestDimension;

		let subject = createBoard(mockCanvas);
		let element = subject.createElement(createLocation(0,0),"DarkRed");
		element.draw();

		let recorder = mockCanvas.recorders.drawArc;
		assert.equal(recorder.timesInvoked(), 1, "Board converts the drawElement into a drawArc");

		let invocation = recorder.invocations[0];
		let actualRadius = invocation.arguments[0];

		assert.equal(
			actualRadius,
			expectedTileSize / 2,
			"Radius of arc drawn should be half the tile size"
		);
	}
);

QUnit.test("Clearing the board means clearing the canvas",
	assert => {
		assert.expect(1);

		let mockCanvas = new MockCanvas();

		let subject = createBoard(mockCanvas);
		subject.clear();

		let recorder = mockCanvas.recorders.clear;
		assert.equal(recorder.timesInvoked(), 1, "Board delegates clear to canvas");
	}
);

QUnit.test("Elements know their location on the board",
	assert => {
		assert.expect(1);
		let expected = createLocation(1,2);

		let subject = createBoard(new MockCanvas());
		let element = subject.createElement(expected,"DarkRed");

		assert.propEqual(
			element.location(),
			expected,
			"Element knows its location"
		);
	}
);

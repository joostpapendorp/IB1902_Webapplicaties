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
		let el = subject.createElement(createLocation(0,0),"DarkRed");
		subject.redraw();

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

QUnit.test("Redraw clears the board, then draws all elements",
	assert => {
		assert.expect(2);

		let mockCanvas = new MockCanvas();
		let subject = createBoard(mockCanvas);

		// el1 and el2 values are ignored
		let el1 = subject.createElement(createLocation(0,0));
		let el2 = subject.createElement(createLocation(1,1));

		subject.redraw();

		let recorders = mockCanvas.recorders;
		assert.equal(recorders.clear.timesInvoked(), 1, "redraw clears the canvas");
		assert.equal(recorders.drawArc.timesInvoked(), 2, "redraw draws both elements");
	}
);

QUnit.test("Elements must be on the board",
	assert => {
		assert.expect(5);

		let subject = createBoard(new MockCanvas());

		assert.throws(
			() => subject.createElement(createLocation(0,BOARD_SIZE)),
			new Error("18 is out of bounds"),
			"Board size is [0..17]"
		);

		assert.throws(
			() => subject.createElement(createLocation(BOARD_SIZE,17)),
			new Error("18 is out of bounds"),
			"Board size is [0..17]"
		);

		assert.throws(
			() => subject.createElement(createLocation(0,-1)),
			new Error("-1 is out of bounds"),
			"Board size is [0..17]"
		);

		assert.throws(
			() => subject.createElement(createLocation(-1,0)),
			new Error("-1 is out of bounds"),
			"Board size is [0..17]"
		);

		let maxLocation = createLocation(BOARD_SIZE-1, BOARD_SIZE-1);
		let actual = subject.createElement(maxLocation, "DarkRed");
		assert.propEqual(
			actual.location,
			maxLocation,
			"Max location is on the board"
		);
	}
);

QUnit.test("Board space must be available to add elements",
	assert => {
		assert.expect(1);

		let subject = createBoard(new MockCanvas());

		let sameLocation = createLocation(1,1);
		let first = subject.createElement(sameLocation, "DarkRed");

		assert.throws(
			() => subject.createElement(sameLocation, "DarkOrange"),
			new Error("Location occupied"),
			"Elements can't share same location"
		);
	}
);


QUnit.module("Elements")

QUnit.test("Elements know their location on the board",
	assert => {
		assert.expect(1);
		let expected = createLocation(1,2);

		let subject = createBoard(new MockCanvas());
		let element = subject.createElement(expected,"DarkRed");

		assert.propEqual(
			element.location,
			expected,
			"Element knows its location"
		);
	}
);

QUnit.test("Elements are immutable",
	assert => {
		assert.expect(1);

		let subject = createBoard(new MockCanvas());
		let element = subject.createElement(createLocation(0,0), "DarkRed");

		assert.throws(
			() => element.location = createLocation(1,1),
			new TypeError("\"location\" is read-only"),
			"Location cannot be changed."
		);
	}
);

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

		let subject = createBoard(mockCanvas, createElementFactory());
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

		let subject = createBoard(mockCanvas, createElementFactory());
		subject.clear();

		let recorder = mockCanvas.recorders.clear;
		assert.equal(recorder.timesInvoked(), 1, "Board delegates clear to canvas");
	}
);

QUnit.test("Redraw clears the board, then draws all elements",
	assert => {
		assert.expect(2);

		let mockCanvas = new MockCanvas();
		let subject = createBoard(mockCanvas, createElementFactory());

		// el1 and el2 values are ignored
		let el1 = subject.createElement(createLocation(0,0));
		let el2 = subject.createElement(createLocation(1,1));

		subject.redraw();

		let recorders = mockCanvas.recorders;
		assert.equal(recorders.clear.timesInvoked(), 1, "redraw clears the canvas");
		assert.equal(recorders.drawArc.timesInvoked(), 2, "redraw draws both elements");
	}
);

QUnit.test("Board records its elements",
	assert => {
		assert.expect(1);
		let subject = createBoard(new MockCanvas(), createElementFactory());

		let location = createLocation(0,0);
		let expected = subject.createElement(location, "DarkRed");

		let actual = subject.elementAt(location);

		assert.propEqual(actual, expected, "Element at location should be the created element");
	}
);

QUnit.test("Empty positions are undefined",
	assert => {
		assert.expect(1);
		let subject = createBoard(new MockCanvas(), createElementFactory());

		let actual = subject.elementAt(createLocation(0,0));

		assert.propEqual(actual, undefined, "Element at location should be the created element");
	}
);

QUnit.test("Cant remove element not on the board",
	assert => {
		assert.expect(1);
		let elementFactory = createElementFactory();
		let subject = createBoard(new MockCanvas(), elementFactory);

		let location = createLocation(0,0);
		let element = elementFactory.createElement(location, "DarkRed");

		assert.throws(
			() => subject.remove(element),
			new Error("No element at (0,0)"),
			"Removing when nothing present throws an error"
		);
	}
);

QUnit.test("Remove element removes an element from the given position",
	assert => {
		assert.expect(1);
		let subject = createBoard(new MockCanvas(), createElementFactory());

		let location = createLocation(0,0);
		let element = subject.createElement(location, "DarkRed");

		subject.remove(element);
		let actual = subject.elementAt(location);

		assert.propEqual(actual, undefined, "Element at location should not be on the board");
	}
);

QUnit.test("Board replaces an element with another at the same location",
	assert => {
		assert.expect(1);
		let elementFactory = createElementFactory();
		let location = createLocation(0,0);
		let expected = elementFactory.createElement(location, "DarkOrange");

		let subject = createBoard(new MockCanvas(), elementFactory);
		let ignored = subject.createElement(location, "DarkRed");
		subject.replace(expected);
		let actual = subject.elementAt(location);

		assert.propEqual(actual, expected, "board replaces element with provided")
	}
);

QUnit.test("Can't replace an empty location",
	assert => {
		assert.expect(1);
		let elementFactory = createElementFactory();
		let subject = createBoard(new MockCanvas(), elementFactory);

		assert.throws(
			() => subject.replace(
				elementFactory.createElement(
					createLocation(0,0),
					"DarkOrange"
				)
			),
			new Error("No element to replace at (0,0)"),
			"Replacing an empty location throws error"
		);
	}
);

QUnit.test("Elements must be on the board",
	assert => {
		assert.expect(6);

		let subject = createBoard(new MockCanvas(), createElementFactory());

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
		let maxElement = subject.createElement(maxLocation, "DarkRed");
		assert.propEqual(
			maxElement.location,
			maxLocation,
			"Max location is on the board"
		);

		let minLocation = createLocation(0, 0);
		let minElement = subject.createElement(minLocation, "DarkRed");
		assert.propEqual(
			minElement.location,
			minLocation,
			"Min location is on the board"
		);
	}
);

QUnit.test("Board space must be available to add elements",
	assert => {
		assert.expect(1);

		let subject = createBoard(new MockCanvas(), createElementFactory());

		let sameLocation = createLocation(1,1);
		let first = subject.createElement(sameLocation, "DarkRed");

		assert.throws(
			() => subject.createElement(sameLocation, "DarkOrange"),
			new Error("Location occupied"),
			"Elements can't share same location"
		);
	}
);

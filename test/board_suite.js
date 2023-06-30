"use strict";


function MockBoard(){
	this.recorders = {
		createElement : new Recorder("createElement"),
		replace : new Recorder("replace"),
		remove : new Recorder("remove"),
		clear : new Recorder("clear"),
		redraw : new Recorder("redraw"),
		elementAt : new Recorder("elementAt"),
		writeAt : new Recorder("writeAt")
	};

	this.createElement = function(location, type){
		this.recorders.createElement.invokedWith([location,type]);
	};

	this.replace = function(element){
		this.recorders.replace.invokedWith([element]);
	};

	this.remove = function(element){
		this.recorders.remove.invokedWith([element]);
	};

	this.clear = function(){
		this.recorders.clear.invoked();
	};

	this.redraw = function(){
		this.recorders.redraw.invoked();
	};

	this.elementAtReturns = function(location) {
		return { type : FREE_SPACE_TYPE };
	};

	this.elementAt = function(location){
		this.recorders.elementAt.invokedWith([location]);
		return this.elementAtReturns(location);
	};

	this.writeAt = function(location, text){
		this.recorders.writeAt.invokedWith([location, text]);
	};
}

QUnit.module("Board");

QUnit.test("Constant values",
	assert => {
		assert.expect(3);

		assert.equal(BOARD_SIZE, 18, "size of the board is 18x18 tiles.");

		assert.equal(OFF_THE_BOARD_ENTITY.description, "Off the board", "Entity used to indicate a space outside the board")
		assert.equal(FREE_SPACE_ENTITY.description, "Free space", "Entity used to indicate a free space on the board")
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
		let el = subject.createElement(createLocation(0,0), MOCK_TYPE);
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


QUnit.test("Writing text at a location translates coordinates to canvas coordinates",
	assert => {
		assert.expect(4);

		const EXPECTED_TILE_SIZE = 4;
		const RADIUS = EXPECTED_TILE_SIZE / 2;
		const EXPECTED_TEXT = "EXPECTED_TEXT";

		let smallestDimension = EXPECTED_TILE_SIZE * BOARD_SIZE;
		let largestDimension = (EXPECTED_TILE_SIZE + 2) * BOARD_SIZE;

		let mockCanvas = new MockCanvas();
		mockCanvas.width = () => smallestDimension;
		mockCanvas.height = () => largestDimension;

		let subject = createBoard(mockCanvas, createElementFactory());

		subject.writeAt(createLocation(1,2), EXPECTED_TEXT);

		let drawText = mockCanvas.recorders.drawText;
		assert.equal(drawText.timesInvoked(), 1, "Board writes the text on the canvas");

		let actualArguments = drawText.invocations[0].arguments;

		assert.equal(actualArguments[0], EXPECTED_TEXT, "Text is passed unchanged");
		assert.equal(actualArguments[1], 1 * EXPECTED_TILE_SIZE + RADIUS, "x-coordinate is converted to canvas coordinates");
		assert.equal(actualArguments[2], 2 * EXPECTED_TILE_SIZE + RADIUS, "y-coordinate is converted to canvas coordinates");
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

QUnit.test("Clearing the board deletes its elements",
	assert => {
		assert.expect(1);

		let mockCanvas = new MockCanvas();

		let subject = createBoard(mockCanvas, createElementFactory());

		subject.createElement(createLocation(0,0), MOCK_TYPE);
		subject.clear();
		subject.redraw();

		let recorder = mockCanvas.recorders.drawArc;
		assert.equal(recorder.timesInvoked(), 0, "After clearing, no elements remain on the board.")
	}
);


QUnit.test("Redraw clears the board, then draws all elements",
	assert => {
		assert.expect(4);

		let mockCanvas = new MockCanvas();
		let subject = createBoard(mockCanvas, createElementFactory());

		let firstElement = subject.createElement(createLocation(0,0), MOCK_TYPE);
		let secondElement = subject.createElement(createLocation(1,1), MOCK_TYPE);

		subject.redraw();

		let recorders = mockCanvas.recorders;
		assert.equal(recorders.clear.timesInvoked(), 1, "redraw clears the canvas");

		let drawArc = recorders.drawArc
		assert.equal(drawArc.timesInvoked(), 2, "redraw draws both elements");

		assert.equal(
			drawArc.invocations[0].arguments[3],
			firstElement.type.color,
			"redraw uses correct color on first");

		assert.equal(
			drawArc.invocations[1].arguments[3],
			secondElement.type.color,
			"redraw uses correct color on second");
	}
);

QUnit.test("Board records its elements",
	assert => {
		assert.expect(1);
		let subject = createBoard(new MockCanvas(), createElementFactory());

		let location = createLocation(0,0);
		let expected = subject.createElement(location, MOCK_TYPE);

		let actual = subject.elementAt(location);

		assert.propEqual(actual, expected, "Element at location should be the created element");
	}
);

QUnit.test("Empty positions are free space",
	assert => {
		assert.expect(2);
		let subject = createBoard(new MockCanvas(), createElementFactory());

		let expectedLocation = createLocation(0,0);
		let actual = subject.elementAt(expectedLocation);

		assert.equal(actual.location, expectedLocation, "Element should be at the created location");
		assert.equal(actual.type, FREE_SPACE_TYPE, "Element should have the free space type");
	}
);

QUnit.test("Cant remove element not on the board",
	assert => {
		assert.expect(1);
		let elementFactory = createElementFactory();
		let subject = createBoard(new MockCanvas(), elementFactory);

		let location = createLocation(0,0);
		let element = elementFactory.createElement(location, MOCK_TYPE);

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
		let element = subject.createElement(location, MOCK_TYPE);

		subject.remove(element);
		let actual = subject.elementAt(location);

		assert.propEqual(actual.type, FREE_SPACE_TYPE, "Element at location should not be on the board");
	}
);

QUnit.test("Board replaces an element with another at the same location",
	assert => {
		assert.expect(1);

		let elementFactory = createElementFactory();
		let location = createLocation(0,0);
		let expected = elementFactory.createElement(location, MOCK_TYPE);

		let subject = createBoard(new MockCanvas(), elementFactory);

		let ignored = subject.createElement(location, SECOND_MOCK_TYPE);
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
				elementFactory.createElement(createLocation(0,0), MOCK_TYPE)
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
			() => subject.createElement(createLocation(0,BOARD_SIZE), MOCK_TYPE),
			new Error("(0,18) is out of bounds"),
			"Board size is [0..17]"
		);

		assert.throws(
			() => subject.createElement(createLocation(BOARD_SIZE,17), MOCK_TYPE),
			new Error("(18,17) is out of bounds"),
			"Board size is [0..17]"
		);

		assert.throws(
			() => subject.createElement(createLocation(0,-1), MOCK_TYPE),
			new Error("(0,-1) is out of bounds"),
			"Board size is [0..17]"
		);

		assert.throws(
			() => subject.createElement(createLocation(-1,0), MOCK_TYPE),
			new Error("(-1,0) is out of bounds"),
			"Board size is [0..17]"
		);

		let maxLocation = createLocation(BOARD_SIZE-1, BOARD_SIZE-1);
		let maxElement = subject.createElement(maxLocation, MOCK_TYPE);
		assert.propEqual(
			maxElement.location,
			maxLocation,
			"Max location is on the board"
		);

		let minLocation = createLocation(0, 0);
		let minElement = subject.createElement(minLocation, MOCK_TYPE);
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
		let first = subject.createElement(sameLocation, MOCK_TYPE);

		assert.throws(
			() => subject.createElement(sameLocation, SECOND_MOCK_TYPE),
			new Error("Location occupied"),
			"Elements can't share same location"
		);
	}
);

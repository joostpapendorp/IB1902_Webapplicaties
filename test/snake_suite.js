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
		let recorder = mockBoard.recorders.createElement;
		let invocations = recorder.invocations;

		let expectedLocations = [
			createLocation(0,0),
			createLocation(1,0),
			createLocation(1,1)
		];

		let subject = createSnakeFactory(mockBoard);
		subject.createSnake(expectedLocations);

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

QUnit.test("When a snake moves, it removes the its last body segment",
	assert => {
		assert.expect(2);

		// actual board to avoid mocks returning mocks.
		let elementFactory = createElementFactory();
		let board = createBoard(new MockCanvas(), elementFactory );

		let lastBodySegmentLocation = createLocation(0,0);
		let subject = createSnakeFactory(board)
			.createSnake([
				lastBodySegmentLocation,
				createLocation(0,1)
			]);

		// partially mock board to spy on future invocations.
		let boardSpy = createSpyFrom(board);
		let recorders = boardSpy.recorders;


		subject.move(DOWN);


		let remove = recorders.remove;
		let actual = elementFactory.createElement(lastBodySegmentLocation,"DarkRed");

		assert.equal(remove.timesInvoked(), 1, "remove the last body segment");
		assert.propEqual(
			remove.invocations[0],
			new Invocation([actual]),
			"remove the actual last body segment"
		);
	}
);

QUnit.test("When a snake moves, it repaints the previous head segment as a body segment",
	assert => {
		assert.expect(2);

		// actual board to avoid mocks returning mocks.
		let elementFactory = createElementFactory();
		let board = createBoard(new MockCanvas(), elementFactory );

		let startingHeadLocation = createLocation(0,1);
		let subject = createSnakeFactory(board)
			.createSnake([
				createLocation(0,0),
				startingHeadLocation
			]);

		// partially mock board to spy on future invocations.
		let boardSpy = createSpyFrom(board);
		let recorders = boardSpy.recorders;


		subject.move(DOWN);


		let replace = recorders.replace;

		assert.equal(replace.timesInvoked(), 1, "paint the previous last segment as body");

		let actual = elementFactory.createElement(startingHeadLocation,"DarkRed");
		assert.propEqual(
			replace.invocations[0],
			new Invocation([actual]),
			"new body element has the same location as old head, but has a different color"
		);
	}
);

QUnit.test("When a snake moves, it adds the new head to the front",
	assert => {
		assert.expect(2);

		// actual board to avoid mocks returning mocks.
		let elementFactory = createElementFactory();
		let board = createBoard(new MockCanvas(), elementFactory );

		let startingHeadLocation = createLocation(0,1);
		let subject = createSnakeFactory(board)
			.createSnake([
				createLocation(0,0),
				startingHeadLocation
			]);

		// partially mock board to spy on future invocations.
		let boardSpy = createSpyFrom(board);
		let recorders = boardSpy.recorders;


		subject.move(DOWN);


		let createElement = recorders.createElement;
		let actualLocation = createLocation(0,2);

		assert.equal(createElement.timesInvoked(), 1, "add a new segment as head");
		assert.propEqual(
			createElement.invocations[0],
			new Invocation([actualLocation,"DarkOrange"]),
			"new body element has the same location as old head, but has a different color"
		);
	}
);


QUnit.test("When a snake moves, it records its new positions for the next moves",
	assert => {
		assert.expect(2);

		// actual board to avoid mocks returning mocks.
		let elementFactory = createElementFactory();
		let board = createBoard(new MockCanvas(), elementFactory );

		let startingHeadLocation = createLocation(0,1);
		let subject = createSnakeFactory(board)
			.createSnake([
				createLocation(0,0),
				startingHeadLocation
			]);

		// partially mock board to spy on future invocations.
		let boardSpy = createSpyFrom(board);
		let recorders = boardSpy.recorders;


		subject.move(DOWN);
		subject.move(DOWN);
		subject.move(DOWN);


		let replace = recorders.replace;
		let remove = recorders.remove;


		function containingLocation(x, y){
			return new Invocation([elementFactory.createElement(createLocation(x,y), "DarkRed")])
		}

		assert.propEqual(
			replace.invocations,
			[
        containingLocation(0,1),
        containingLocation(0,2),
        containingLocation(0,3)
      ],
			"moving adjusts all old heads"
		);

		assert.propEqual(
			remove.invocations,
			[
        containingLocation(0,0),
        containingLocation(0,1),
        containingLocation(0,2)
      ],
			"moving removes all old tails"
		)
	}
);

function createSpyFrom(board){
	let mockBoard = new MockBoard()
	let factory = createElementFactory();

	board.replace = function(element){
	 mockBoard.replace(element);
	};

	board.remove = function(element){
		mockBoard.remove(element);
	}

	board.createElement = function(location, color){
		mockBoard.createElement(location, color);
		return factory.createElement(location, color);
	}

	return mockBoard;
}

"use strict";

QUnit.module("Snake");

QUnit.test("Constant values",
	assert => {
	  assert.expect(8);

		assert.equal( SNAKE_ENTITY.description, "Snake");

	  assert.propEqual( SNAKE_HEAD_TYPE.color, "DarkOrange", "Color of the snake's head is orange" )
	  assert.equal( SNAKE_BODY_TYPE.color, "DarkRed", "Color of the snake's body is red" )

	  assert.equal( DEAD_SNAKE_HEAD_TYPE.color, "DarkGrey", "Color of the dead snake's head is gray" )
	  assert.equal( DEAD_SNAKE_BODY_TYPE.color, "Black", "Color of the dead snake's body is blac" )

	  assert.equal(SNAKE_MOVED, "Snake moved", "Game state: Snake has moved.");
	  assert.equal(SNAKE_DIED, "Snake died", "Game state: Snake was killed");
	  assert.equal(SNAKE_ATE, "Snake ate", "Game state: Snake ate a food");
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
			[expectedLocations[0],SNAKE_BODY_TYPE],
			"The first body segment uses the first coordinate given."
		);

		assert.propEqual(
			invocations[1].arguments,
			[expectedLocations[1], SNAKE_BODY_TYPE],
			"The second body segment uses the second coordinate given."
		);

		assert.propEqual(
			invocations[2].arguments,
			[expectedLocations[2],SNAKE_HEAD_TYPE],
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


		subject.push(DOWN);


		let remove = recorders.remove;
		let actual = elementFactory.createElement(lastBodySegmentLocation, SNAKE_BODY_TYPE);

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


		subject.push(DOWN);


		let replace = recorders.replace;

		assert.equal(replace.timesInvoked(), 1, "paint the previous last segment as body");

		let actual = elementFactory.createElement(startingHeadLocation, SNAKE_BODY_TYPE);
		assert.propEqual(
			replace.invocations[0],
			new Invocation([actual]),
			"new body element has the same location as old head, but has a different type"
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


		subject.push(DOWN);


		let createElement = recorders.createElement;
		let actualLocation = createLocation(0,2);

		assert.equal(createElement.timesInvoked(), 1, "add a new segment as head");
		assert.propEqual(
			createElement.invocations[0],
			new Invocation([actualLocation, SNAKE_HEAD_TYPE]),
			"A new element is added as the head at the new location."
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


		subject.push(DOWN);
		subject.push(DOWN);
		subject.push(DOWN);


		let replace = recorders.replace;
		let remove = recorders.remove;


		function containingLocation(x, y){
			return new Invocation([elementFactory.createElement(createLocation(x,y), SNAKE_BODY_TYPE)])
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


QUnit.test("Moving from the board kills the snake.",
	assert => {
		assert.expect(4);

		let board = createBoard(new MockCanvas(), createElementFactory());
		let snakeFactory = createSnakeFactory(board);

		let lowerBoundSnake = snakeFactory.createSnake([
			createLocation(0,1),
			createLocation(0,0)
		]);
		let upperBoundSnake = snakeFactory.createSnake([
			createLocation(17,16),
			createLocation(17,17)
		]);

		for(const [direction, subject, description] of [
			[UP, lowerBoundSnake, "top"],
			[LEFT, lowerBoundSnake, "left"],
			[DOWN, upperBoundSnake, "bottom"],
			[RIGHT, upperBoundSnake, "right"]
		]){
			let result = subject.push(direction);
			assert.equal(result, SNAKE_DIED, `Snake was killed moving off the ${description} of the board.`)
		};
	}
);


QUnit.test("Moving onto its own body kills the snake.",
	assert => {
		assert.expect(1);

		let board = createBoard(new MockCanvas(), createElementFactory());
		let snakeFactory = createSnakeFactory(board);

		let subject = snakeFactory.createSnake([
			createLocation(0,1),
			createLocation(0,0)
		]);

		let result = subject.push(DOWN);
		assert.equal(result, SNAKE_DIED, "Snake was killed by moving onto its own body.");
	}
);


QUnit.test("When a snake dies, it turns black.",
	assert => {
		assert.expect(3);

		let elementFactory = createElementFactory();
		let board = createBoard(new MockCanvas(), elementFactory);

		let mockBoard = createSpyFrom(board);
		let recorder = mockBoard.recorders.replace;
		let invocations = recorder.invocations;

		let expectedLocations = [
			createLocation(1,1),
			createLocation(1,0),
			createLocation(0,0)
		];

		let snakeFactory = createSnakeFactory(board);
		let subject = snakeFactory.createSnake(expectedLocations);

		subject.push(UP);

		assert.propEqual(
			invocations[0].arguments,
			[elementFactory.createElement(expectedLocations[0], DEAD_SNAKE_BODY_TYPE)],
			"The first body segment turns black."
		);

		assert.propEqual(
			invocations[1].arguments,
			[elementFactory.createElement(expectedLocations[1], DEAD_SNAKE_BODY_TYPE)],
			"The second body segment turns black."
		);

		assert.propEqual(
			invocations[2].arguments,
			[elementFactory.createElement(expectedLocations[2], DEAD_SNAKE_HEAD_TYPE)],
			"The last segment is the head and it turns grey."
		);
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

	board.createElement = function(location, type){
		mockBoard.createElement(location, type);
		return factory.createElement(location, type);
	}

	return mockBoard;
}

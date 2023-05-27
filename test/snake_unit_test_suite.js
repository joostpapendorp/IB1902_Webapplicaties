QUnit.module("Initialization");

QUnit.test("Constant values",
	assert => {
	  assert.expect(1);

	  assert.equal( SNAKE_CANVAS_ID, "mySnakeCanvas", "Element id of the canvas uses that of the HTML" );
	}
);

QUnit.test("Canvas initialization uses JQuery element with the correct ID",
	assert => {
		assert.expect(2);

		let props = {
			id : SNAKE_CANVAS_ID,
			testProperty : "test"
		}

		withMockHTMLElement("div", props,
			element => {
				withMockCreateCanvas(
					recorder => {
						buildInjectionContext();

						assert.true(recorder.invoked, "canvas created");

						let actual = recorder.argument.prop("testProperty");
						assert.equal( actual, "test", "Context uses HTML element with correct id")
					}
				);
			}
		);
	}
);

QUnit.test("Starting snake is two segments long, placed in left of the center, facing up",
	assert => {
		assert.expect(2);

		let mockSnakeFactory = new MockSnakeFactory();
		let expectedLocations = [
			createLocation(8, 9),
			createLocation(8, 8)
		];

		createStartSnake(mockSnakeFactory);

		let recorder = mockSnakeFactory.recorders.createSnake
		assert.equal(recorder.timesInvoked(), 1, "One snake is created");

		assert.propEqual(
			recorder.invocations[0],
			new Invocation([expectedLocations]),
			"Snake is located left of the center, facing up"
		);
	}
);


QUnit.module("Exit");

QUnit.test("Stop clears the board.",
	assert => {
		assert.expect(1);

		let mockBoard = new MockBoard();

		//last global!
		game = { board : mockBoard };

		stop();

		let recorder = mockBoard.recorders.clear;
		assert.equal(recorder.timesInvoked(), 1, "Invoked clear");
	}
);


// loan pattern to mock out createCanvas: treat as global.
function withMockCreateCanvas(testFunction){
	let recorder = { invoked : false, argument : ""};
	let temp = createCanvas;

	createCanvas = function(arg){
		recorder.invoked = true;
		recorder.argument = arg;

		return new MockCanvas();
	}

	testFunction(recorder);

	createCanvas = temp;
}

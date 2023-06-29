import {SNAKE_CANVAS_ID, buildInjectionContext} from "../web/snake_student.js";

"use strict";

QUnit.module("Snake student");

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

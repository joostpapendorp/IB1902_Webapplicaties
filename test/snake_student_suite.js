import {SNAKE_CANVAS_ID, buildInjectionContext} from "../web/snake_student.js";

import {createCanvas} from "../web/snake_canvas.js";

"use strict";

QUnit.module("Snake student");

QUnit.test("Constant values",
	assert => {
	  assert.expect(1);

	  assert.equal( SNAKE_CANVAS_ID, "mySnakeCanvas", "Element id of the canvas uses that of the HTML" );
	}
);

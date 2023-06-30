import {createLocation, NO_LOCATION} from "../web/snake_location.js";
import {
	createPlayer,
	LEFT_ARROW_KEY_CODE, UP_ARROW_KEY_CODE, RIGHT_ARROW_KEY_CODE, DOWN_ARROW_KEY_CODE,
	MOVE_LEFT, MOVE_UP, MOVE_RIGHT, MOVE_DOWN
} from "../web/snake_player.js";

"use strict";


QUnit.module("Player");

QUnit.test("Constants",
	assert => {
		assert.expect(4);

		assert.propEqual(
			MOVE_UP,
			createLocation(0, -1),
			"UP moves negative y"
		);

		assert.propEqual(
			MOVE_DOWN,
			createLocation(0, 1),
			"UP moves positive y"
		);

		assert.propEqual(
			MOVE_LEFT,
			createLocation(-1, 0),
			"LEFT moves negative x"
		);

		assert.propEqual(
			MOVE_RIGHT,
			createLocation(1, 0),
			"LEFT moves positive x"
		);
	}
);

QUnit.test("Constant values",
	assert => {
	  assert.expect(4);

	  assert.equal(LEFT_ARROW_KEY_CODE, 37, "ASCII left arrow key code");
	  assert.equal(UP_ARROW_KEY_CODE, 38, "ASCII up arrow key code");
	  assert.equal(RIGHT_ARROW_KEY_CODE, 39, "ASCII right arrow key code");
	  assert.equal(DOWN_ARROW_KEY_CODE, 40, "ASCII down arrow key code");
	}
);


QUnit.test("Player converts key codes into steering directions",
	assert => {
	  assert.expect(4);

		let subject = createPlayer();

		for( const [code, expectedDirection] of [
			[LEFT_ARROW_KEY_CODE, MOVE_LEFT],
			[UP_ARROW_KEY_CODE, MOVE_UP],
			[RIGHT_ARROW_KEY_CODE, MOVE_RIGHT],
			[DOWN_ARROW_KEY_CODE, MOVE_DOWN]
		]){
			let actualDirection = subject.receive(code);
			assert.equal(actualDirection, expectedDirection, `player converts ${code} to ${expectedDirection.describe()}` );
		}
	}
);


QUnit.test("Player converts unknown codes into sentinel value",
	assert => {
	  assert.expect(1);

		const UNKNOWN_CODE = -1;

		let subject = createPlayer();

		let actualDirection = subject.receive(UNKNOWN_CODE);
		assert.equal(actualDirection, NO_LOCATION, "player converts unknown codes to NO_LOCATION" );
	}
);

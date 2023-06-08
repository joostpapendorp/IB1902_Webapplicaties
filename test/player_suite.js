"use strict";

QUnit.module("Player");

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
	  assert.expect(8);

		for( const [code, expectedDirection] of [
			[LEFT_ARROW_KEY_CODE, LEFT],
			[UP_ARROW_KEY_CODE, UP],
			[RIGHT_ARROW_KEY_CODE, RIGHT],
			[DOWN_ARROW_KEY_CODE, DOWN]
		]){
			let mockGame = new MockGame();
			let subject = createPlayer(mockGame);

			subject.receive(code);

			let steer = mockGame.recorders.steer;
			assert.equal(steer.timesInvoked(), 1, `player calls game for ${code}`);
			let actualDirection = steer.invocations[0].arguments[0];
			assert.equal(actualDirection, expectedDirection, `player converts ${code} to ${expectedDirection.describe()}` );
		}
	}
);

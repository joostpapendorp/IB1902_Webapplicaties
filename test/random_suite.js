import {random} from "../web/snake_random.js";
import {MockMath} from "./mock_adapters.js";

"use strict";

QUnit.module("Random");

QUnit.test("Random location uses the math functions",
	assert => {
		assert.expect(3);

		const FIRST_RANDOM = 1, SECOND_RANDOM = 2;
		const EXPECTED_X = 3, EXPECTED_Y =4;

		let randomValues = iterateReturnValuesOver([FIRST_RANDOM,SECOND_RANDOM]);

		let floorValues = function(value){
			switch(value) {
				case FIRST_RANDOM * BOARD_SIZE:
					return EXPECTED_X;

				case SECOND_RANDOM * BOARD_SIZE:
					return EXPECTED_Y;

				default:
					return -1;
			}
		};

		let mockMath = new MockMath(randomValues, floorValues);

		let subject = random(mockMath);

		let actual = subject.randomizeLocation();

		let mathRandom = mockMath.recorders.random;
		assert.equal(mathRandom.timesInvoked(),2, "Both coordinates are randomized")

		let floor = mockMath.recorders.floor;
		assert.equal(floor.timesInvoked(), 2, "Both coordinates are floored")
		assert.propEqual(actual, createLocation(EXPECTED_X, EXPECTED_Y), "location uses floored results");
	}
);

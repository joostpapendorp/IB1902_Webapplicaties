import {
	FOOD_ENTITY,
	FOOD_TYPE,

	foodPlanter
} from "../web/snake_food.js";
import {FREE_SPACE_TYPE} from "../web/snake_board.js";

import {Recorder} from "./mocks.js";
import {MOCK_TYPE} from "./element_suite.js";
import {MockBoard} from "./board_suite.js";
import {iterateReturnValuesOver} from "./mocks.js";

"use strict";

export function MockFood(){
	this.recorders = {
		plant : new Recorder("plantFood"),
	};

	this.plant = function(){
		this.recorders.plant.invoked();
	};
}


QUnit.module("Food");

QUnit.test("Constant values",
	assert => {
		assert.expect(2);

		assert.equal( FOOD_ENTITY.description, "Food", "Food is a separate entity" );
	  assert.equal( FOOD_TYPE.color, "Olive", "Color of the food is olive" )
	}
);


QUnit.test("Food planter plants a food on the board at a random location.",
	assert => {
		assert.expect(3);

		let mockBoard = new MockBoard();
		let subject = foodPlanter(mockBoard, () => MOCK_LOCATION);

		subject.plant();

		let createElement = mockBoard.recorders.createElement;
		assert.equal(createElement.timesInvoked(), 1, "planter creates one new food");
		let actual = createElement.invocations[0].arguments
		assert.equal(actual[0], MOCK_LOCATION, "Planter uses random location");
		assert.equal(actual[1], FOOD_TYPE, "Planter marks element as food.");
	}
);


QUnit.test("Food planter retries until a free space is found.",
	assert => {
		assert.expect(3);

		let mockBoard = new MockBoard();
		mockBoard.elementAtReturns = function(location) {
			return location === MOCK_LOCATION ?
				{ type : MOCK_TYPE } :
				{ type : FREE_SPACE_TYPE };
		};

		let subject = foodPlanter(
			mockBoard,
			iterateReturnValuesOver([MOCK_LOCATION, MOCK_LOCATION, SECOND_MOCK_LOCATION])
		);

		subject.plant();

		let elementAt = mockBoard.recorders.elementAt;
		assert.equal(elementAt.timesInvoked(), 3, "board is queried for each attempt" );

		let createElement = mockBoard.recorders.createElement;
		assert.equal(createElement.timesInvoked(), 1, "only one element is created" );
		assert.equal(createElement.invocations[0].arguments[0], SECOND_MOCK_LOCATION, "element is created at free location");
	}
);

"use strict";

QUnit.module("Rule Set");

QUnit.test("Constant values",
	assert => {
		assert.expect(2);

		assert.equal(INITIAL_DIRECTION, UP, "Snake initial direction is up");
		assert.equal(NUMBER_OF_FOODS_PER_BASIC_GAME, 5, "Basic game places 5 units of food");
	}
);

QUnit.test("Rule set provides the initial direction",
	assert => {
		assert.expect(1);

		let subject = ruleSets().basic();

		assert.equal(subject.initialDirection(), INITIAL_DIRECTION, "provides the constant as initial direction");
	}
);

QUnit.test("Basic rule set plants a fixed amount of food",
	assert => {
		assert.expect(1);

		let mockFoodPlanter = new MockFood();
		let subject = ruleSets(mockFoodPlanter).basic();

		subject.prepare();

		let plant = mockFoodPlanter.recorders.plant;
		assert.equal(plant.timesInvoked(), NUMBER_OF_FOODS_PER_BASIC_GAME, "Planter is invoked for each piece of food");
	}
);

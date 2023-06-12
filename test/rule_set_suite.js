"use strict";

QUnit.module("Rule Set");

QUnit.test("Constant values",
	assert => {
		assert.expect(6);

		assert.equal(INITIAL_DIRECTION, UP, "Snake initial direction is up");
		assert.equal(NUMBER_OF_FOODS_PER_BASIC_GAME, 5, "Basic game places 5 units of food");

		assert.equal(NEW_GAME_STATE.description, "New game", "New game has not been initialized");
		assert.equal(GAME_RUNNING_STATE.description, "Game running", "Running game");
		assert.equal(GAME_OVER_STATE.description, "Game over", "Losing the game is Game over");
		assert.equal(GAME_WON_STATE.description, "Game won", "Winning the game is Game won");
	}
);


QUnit.test("Rule set provides the initial direction",
	assert => {
		assert.expect(1);

		let subject = ruleSets().basic();

		assert.equal(subject.initialDirection(), INITIAL_DIRECTION, "provides the constant as initial direction");
	}
);


QUnit.test("Preparing initializes the game.",
	assert => {
		assert.expect(1);

		let subject = ruleSets(new MockFood()).basic();

		assert.equal(subject.prepare(), NEW_GAME_STATE, "Preparing yields the new game state");
	}
);


QUnit.test("Starting the game result in it running",
	assert => {
		assert.expect(1);

		let subject = ruleSets(new MockFood()).basic();
		subject.prepare();

		assert.equal(subject.start(), GAME_RUNNING_STATE, "Starting yields the game running state");
	}
);


QUnit.test("Moving the snake continues the game",
	assert => {
		assert.expect(1);

		let subject = ruleSets(new MockFood()).basic();
		subject.prepare();
		subject.start();

		assert.equal(subject.update(SNAKE_MOVED), GAME_RUNNING_STATE, "Updating with a moved snake yields the game running state");
	}
);


QUnit.test("Killing the snake loses the game",
	assert => {
		assert.expect(1);

		let subject = ruleSets(new MockFood()).basic();
		subject.prepare();
		subject.start();

		assert.equal(subject.update(SNAKE_DIED), GAME_OVER_STATE, "Updating with a dead snake yields the game over state");
	}
);


QUnit.test("In a basic game, eating food while food remains continues the game and eating all the food wins the game.",
	assert => {
		assert.expect(NUMBER_OF_FOODS_PER_BASIC_GAME);

		let subject = ruleSets(new MockFood()).basic();
		subject.prepare();
		subject.start();

		for(let i = 0; i< NUMBER_OF_FOODS_PER_BASIC_GAME - 1; i++)
			assert.equal(subject.update(SNAKE_ATE), GAME_RUNNING_STATE, "Eating food yields game running state");

		assert.equal(subject.update(SNAKE_ATE), GAME_WON_STATE, "Eating the last food yields game won state");
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

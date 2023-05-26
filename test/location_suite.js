"use strict";

QUnit.module("Location and directions");

QUnit.test("Constants",
	assert => {
		assert.expect(4);

		assert.propEqual(
			UP,
			{x: 0, y : -1},
			"UP moves negative y"
		);

		assert.propEqual(
			DOWN,
			{x: 0, y : 1},
			"UP moves positive y"
		);

		assert.propEqual(
			LEFT,
			{x: -1, y : 0},
			"LEFT moves negative x"
		);

		assert.propEqual(
			RIGHT,
			{x: 1, y : 0},
			"LEFT moves positive x"
		);
	}
);

QUnit.test("location has accessible coordinates",
	assert => {
		assert.expect(2);

		let subject = createLocation(1, 2);

		assert.equal(subject.x, 1, "location has x-coordinate");
		assert.equal(subject.y, 2, "location has y-coordinate");
	}
);

QUnit.test("Location is immutable",
	assert => {
		assert.expect(1);

		let subject = createLocation(1,2);

		assert.throws(
			() => subject.x = 2,
			new TypeError("\"x\" is read-only"),
			"Coordinate cannot be changed."
		);
	}
);

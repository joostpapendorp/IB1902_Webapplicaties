"use strict";

QUnit.module("Location and directions");

QUnit.test("Constants",
	assert => {
		assert.expect(5);

		assert.propEqual(
			UP,
			createLocation(0, -1),
			"UP moves negative y"
		);

		assert.propEqual(
			DOWN,
			createLocation(0, 1),
			"UP moves positive y"
		);

		assert.propEqual(
			LEFT,
			createLocation(-1, 0),
			"LEFT moves negative x"
		);

		assert.propEqual(
			RIGHT,
			createLocation(1, 0),
			"LEFT moves positive x"
		);

		assert.propEqual(
			NO_LOCATION,
			createLocation(0, 0),
			"Sentinel for unknown location"
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

QUnit.test("Coordinates of a translated location are the sum of the origin and the translation.",
	assert => {
		assert.expect(1);

		let subject = createLocation(1,2);
		let translation = createLocation(3,4);

		let actual = subject.translated(translation);

		assert.propEqual(
			actual,
			createLocation(4,6),
			"Translating (1,2) by (3,4) yields (2,6)"
		)
	}
);

QUnit.test("Coordinates have a string description.",
	assert => {
		assert.expect(1);

		assert.equal(
			createLocation(1,2).describe(),
			"(1,2)",
			"coordinate at x=1, y=2 describes as (1,2)"
		);
	}
);

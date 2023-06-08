"use strict";

QUnit.module("Elements");

QUnit.test("Elements know their location on the board",
	assert => {
		assert.expect(1);
		let expected = createLocation(1,2);

	  let subject = createElementFactory();
		let element = subject.createElement(expected, "DarkRed");

		assert.propEqual(
			element.location,
			expected,
			"Element knows its location"
		);
	}
);

QUnit.test("Elements are immutable",
	assert => {
		assert.expect(1);

	  let subject = createElementFactory();
		let element = subject.createElement(createLocation(0,0), "DarkRed");

		assert.throws(
			() => element.location = createLocation(1,1),
			new TypeError("\"location\" is read-only"),
			"Location cannot be changed."
		);
	}
);

QUnit.test("Updating the color creates a new element",
	assert => {
		assert.expect(2);

		let subject = createElementFactory();
		let location = createLocation(0,0);
		let original = subject.createElement(location, "DarkRed");

		let updated = original.withColor("DarkOrange");

		assert.propEqual(
			updated,
			subject.createElement(location, "DarkOrange"),
			"Only color changes"
		);


		assert.propEqual(
			original,
			subject.createElement(location, "DarkRed"),
			"original doesn't change");
	}
);

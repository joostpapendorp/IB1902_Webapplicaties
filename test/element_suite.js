import {createLocation} from "../web/snake_location.js";
import {createElementFactory, createElementType, createElementEntity} from "../web/snake_element.js";

"use strict";


export const MOCK_TYPE = createElementType("MOCK_COLOR", createElementEntity("MOCK_TYPE"));
export const SECOND_MOCK_TYPE = createElementType("SECOND_MOCK_TYPE", createElementEntity("SECOND_MOCK_TYPE"));

QUnit.module("Elements");

QUnit.test("Elements know their location on the board",
	assert => {
		assert.expect(1);
		let expected = createLocation(1,2);

	  let subject = createElementFactory();
		let element = subject.createElement(expected, MOCK_TYPE);

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
		let element = subject.createElement(createLocation(0,0), MOCK_TYPE);

		assert.throws(
			() => element.location = createLocation(1,1),
			new TypeError("\"location\" is read-only"),
			"Location cannot be changed."
		);
	}
);

QUnit.test("Updating the type creates a new element",
	assert => {
		assert.expect(2);

		let subject = createElementFactory();
		let location = createLocation(0,0);
		let original = subject.createElement(location, MOCK_TYPE);

		let updated = original.withType(SECOND_MOCK_TYPE);

		assert.propEqual(
			updated,
			subject.createElement(location, SECOND_MOCK_TYPE),
			"Only the type is updated"
		);

		assert.propEqual(
			original,
			subject.createElement(location, MOCK_TYPE),
			"original doesn't change");
	}
);

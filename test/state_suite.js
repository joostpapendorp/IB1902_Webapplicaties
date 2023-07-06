import {createState} from "../web/snake_state.js";

"use strict";

const MOCK_DESCRIPTION = "MOCK DESCRIPTION";

QUnit.module("State");

QUnit.test("State has description",
	assert => {
		assert.expect(1);

		let subject = createState(MOCK_DESCRIPTION);

		assert.equal(subject.description, MOCK_DESCRIPTION, "state records its description");
	}
);

QUnit.test("State is immutable",
	assert => {
		assert.expect(1);

		let subject = createState(MOCK_DESCRIPTION);

		assert.throws(
			() => subject.description = "CHANGED DESCRIPTION",
			new TypeError("\"description\" is read-only"),
			"Description cannot be changed."
		);
	}
);

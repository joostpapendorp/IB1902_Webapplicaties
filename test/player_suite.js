import {createLocation} from "../web/snake_location.js";
import {
	createPlayer, createSteerCommand,
	LEFT_ARROW_KEY_CODE, UP_ARROW_KEY_CODE, RIGHT_ARROW_KEY_CODE, DOWN_ARROW_KEY_CODE, SPACE_BAR_KEY_CODE, ENTER_KEY_CODE,
	MOVE_LEFT, MOVE_UP, MOVE_RIGHT, MOVE_DOWN,
	STEER_COMMAND_TYPE, PAUSE_COMMAND_TYPE, START_COMMAND_TYPE, NO_COMMAND_TYPE,
	PAUSE_COMMAND, START_COMMAND, NO_COMMAND
} from "../web/snake_player.js";

import {Recorder} from "./mocks.js";

"use strict";


export function MockPlayer(returnValue){
	this.recorders = {
		receive : new Recorder("receive"),
	};

	this.returnValue = returnValue || NO_COMMAND;

	this.receive = function(input){
		this.recorders.receive.invokedWith([input]);
		return returnValue;
	};
}

QUnit.module("Player");

QUnit.test("Constant values",
	assert => {
		assert.expect(17);

		assert.propEqual(
			MOVE_UP,
			createLocation(0, -1),
			"UP moves negative y"
		);

		assert.propEqual(
			MOVE_DOWN,
			createLocation(0, 1),
			"UP moves positive y"
		);

		assert.propEqual(
			MOVE_LEFT,
			createLocation(-1, 0),
			"LEFT moves negative x"
		);

		assert.propEqual(
			MOVE_RIGHT,
			createLocation(1, 0),
			"LEFT moves positive x"
		);

		assert.propEqual(
			STEER_COMMAND_TYPE.description,
			"STEER COMMAND",
			"Command type used to group commands that steer the snake"
		);

		assert.propEqual(
			PAUSE_COMMAND_TYPE.description,
			"PAUSE COMMAND",
			"Command type used to group commands that pause the game"
		);

		assert.propEqual(
			START_COMMAND_TYPE.description,
			"START COMMAND",
			"Command type used to group commands that start the game"
		);

		assert.propEqual(
			NO_COMMAND_TYPE.description,
			"NO COMMAND",
			"Command type used to group commands to handle unknown key inputs"
		);

		assert.propEqual(
			PAUSE_COMMAND,
			{type:PAUSE_COMMAND_TYPE, target: {}},
			"Sentinel command used to pause the game"
		);

		assert.propEqual(
			START_COMMAND,
			{type:START_COMMAND_TYPE, target: {}},
			"Sentinel command used to start the game"
		);

		assert.propEqual(
			NO_COMMAND,
			{type: NO_COMMAND_TYPE, target: {}},
			"Sentinel command used to indicate unknown key input"
		);

	  assert.equal(LEFT_ARROW_KEY_CODE, 37, "ASCII left arrow key code");
	  assert.equal(UP_ARROW_KEY_CODE, 38, "ASCII up arrow key code");
	  assert.equal(RIGHT_ARROW_KEY_CODE, 39, "ASCII right arrow key code");
	  assert.equal(DOWN_ARROW_KEY_CODE, 40, "ASCII down arrow key code");
	  assert.equal(SPACE_BAR_KEY_CODE, 32, "ASCII space bar key code");
	  assert.equal(ENTER_KEY_CODE, 13, "ASCII enter key code");
	}
);


QUnit.test("Player converts arrow key codes into steering directions",
	assert => {
	  assert.expect(4);

		let subject = createPlayer();

		for( const [code, expectedDirection] of [
			[LEFT_ARROW_KEY_CODE, MOVE_LEFT],
			[UP_ARROW_KEY_CODE, MOVE_UP],
			[RIGHT_ARROW_KEY_CODE, MOVE_RIGHT],
			[DOWN_ARROW_KEY_CODE, MOVE_DOWN]
		]){
			let actualCommand = subject.receive(code);
			let expectedCommand = createSteerCommand(expectedDirection)
			assert.propEqual(
				actualCommand,
				expectedCommand,
				`player converts ${code} to ${actualCommand.type.description} in direction ${expectedDirection.describe()}` );
		}
	}
);


QUnit.test("Player converts space bar code into pause command",
	assert => {
	  assert.expect(1);

		let subject = createPlayer();

		let actualCommand = subject.receive(SPACE_BAR_KEY_CODE);
		assert.equal(actualCommand, PAUSE_COMMAND, "player converts space bar code to sentinel command" );
	}
);


QUnit.test("Player converts enter code into start command",
	assert => {
	  assert.expect(1);

		let subject = createPlayer();

		let actualCommand = subject.receive(ENTER_KEY_CODE);
		assert.equal(actualCommand, START_COMMAND, "player converts enter code to sentinel command" );
	}
);


QUnit.test("Player converts unknown codes into sentinel value",
	assert => {
	  assert.expect(1);

		const UNKNOWN_CODE = -1;

		let subject = createPlayer();

		let actualCommand = subject.receive(UNKNOWN_CODE);
		assert.equal(actualCommand, NO_COMMAND, "player converts unknown codes to NO_COMMAND" );
	}
);

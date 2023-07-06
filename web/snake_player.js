import {createLocation} from "./snake_location.js";

"use strict";


export const LEFT_ARROW_KEY_CODE = 37;
export const UP_ARROW_KEY_CODE = 38;
export const RIGHT_ARROW_KEY_CODE = 39;
export const DOWN_ARROW_KEY_CODE = 40;
export const SPACE_BAR_KEY_CODE = 32;
export const ENTER_KEY_CODE = 13;

export const MOVE_LEFT = createLocation(-1,0);
export const MOVE_UP = createLocation(0,-1);
export const MOVE_RIGHT = createLocation(1,0);
export const MOVE_DOWN = createLocation(0,1);

export const STEER_COMMAND_TYPE = createCommandType("STEER COMMAND");
export const PAUSE_COMMAND_TYPE = createCommandType("PAUSE COMMAND");
export const START_NEW_GAME_COMMAND_TYPE = createCommandType("START NEW GAME COMMAND");
export const NO_COMMAND_TYPE = createCommandType("NO COMMAND");

const NO_TARGET = {};
export const PAUSE_COMMAND = createCommand(PAUSE_COMMAND_TYPE, NO_TARGET);
export const START_NEW_GAME_COMMAND = createCommand(START_NEW_GAME_COMMAND_TYPE, NO_TARGET);
export const NO_COMMAND = createCommand(NO_COMMAND_TYPE, NO_TARGET);


export function createPlayer(){
	return {
		receive : function(code){
			switch (code) {
				case LEFT_ARROW_KEY_CODE:
					return createSteerCommand(MOVE_LEFT);

				case UP_ARROW_KEY_CODE:
					return createSteerCommand(MOVE_UP);

				case RIGHT_ARROW_KEY_CODE:
					return createSteerCommand(MOVE_RIGHT);

				case DOWN_ARROW_KEY_CODE:
					return createSteerCommand(MOVE_DOWN);

				case SPACE_BAR_KEY_CODE:
					return PAUSE_COMMAND;

				case ENTER_KEY_CODE:
					return START_NEW_GAME_COMMAND;

				default:
					return NO_COMMAND;
			}
		}
	}
}

export function createSteerCommand(direction){
	return createCommand(STEER_COMMAND_TYPE, direction);
}

function createCommand(type, target){
	let command = new Command(type, target);
	Object.freeze(command);
	return command;
}

function Command(type, target){
	this.type = type;
	this.target = target;
}

function createCommandType(description){
	let commandType = new CommandType(description);
	Object.freeze(commandType);
	return commandType;
}

function CommandType(description){
	this.description = description;
}

import {createLocation, NO_LOCATION} from "./snake_location.js";

"use strict";


export const LEFT_ARROW_KEY_CODE = 37;
export const UP_ARROW_KEY_CODE = 38;
export const RIGHT_ARROW_KEY_CODE = 39;
export const DOWN_ARROW_KEY_CODE = 40;

export const MOVE_LEFT = createLocation(-1,0);
export const MOVE_UP = createLocation(0,-1);
export const MOVE_RIGHT = createLocation(1,0);
export const MOVE_DOWN = createLocation(0,1);

export function createPlayer(){
	return {
		receive : function(code){
			switch (code) {
				case LEFT_ARROW_KEY_CODE:
					return MOVE_LEFT;

				case UP_ARROW_KEY_CODE:
					return MOVE_UP;

				case RIGHT_ARROW_KEY_CODE:
					return MOVE_RIGHT;

				case DOWN_ARROW_KEY_CODE:
					return MOVE_DOWN;

				default:
					return NO_LOCATION;
			}
		}
	}
}

"use strict";

export const LEFT_ARROW_KEY_CODE = 37;
export const UP_ARROW_KEY_CODE = 38;
export const RIGHT_ARROW_KEY_CODE = 39;
export const DOWN_ARROW_KEY_CODE = 40;

export function createPlayer(){
	return {
		receive : function(code){
			switch (code) {
				case LEFT_ARROW_KEY_CODE:
					return LEFT;

				case UP_ARROW_KEY_CODE:
					return UP;

				case RIGHT_ARROW_KEY_CODE:
					return RIGHT;

				case DOWN_ARROW_KEY_CODE:
					return DOWN;

				default:
					return NO_LOCATION;
			}
		}
	}
}

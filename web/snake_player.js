"use strict";

const LEFT_ARROW_KEY_CODE = 37;
const UP_ARROW_KEY_CODE = 38;
const RIGHT_ARROW_KEY_CODE = 39;
const DOWN_ARROW_KEY_CODE = 40;

function createPlayer(){
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

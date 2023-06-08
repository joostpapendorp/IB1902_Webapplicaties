"use strict";

const LEFT_ARROW_KEY_CODE = 37;
const UP_ARROW_KEY_CODE = 38;
const RIGHT_ARROW_KEY_CODE = 39;
const DOWN_ARROW_KEY_CODE = 40;

function createPlayer(game){

	return {
		receive : function(code){
			var direction;
			switch (code) {
				case LEFT_ARROW_KEY_CODE:
					direction = LEFT;
					break;

				case UP_ARROW_KEY_CODE:
					direction = UP;
					break;

				case RIGHT_ARROW_KEY_CODE:
					direction = RIGHT;
					break;

				case DOWN_ARROW_KEY_CODE:
					direction = DOWN;
					break;
			}
			game.steer(direction);
		}
	}
}

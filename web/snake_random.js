import {createLocation} from "./snake_location.js";
import {BOARD_SIZE} from "./snake_board.js";

"use strict";


export function random(math) {
	function randomInt(min, max) {
		return math.floor(math.random() * (max - min)) + min;
	}

	function randomizeLocation() {

		return createLocation(
			randomInt(0, BOARD_SIZE),
			randomInt(0, BOARD_SIZE)
		);
	}

	return {
		randomizeLocation : randomizeLocation
	};
}

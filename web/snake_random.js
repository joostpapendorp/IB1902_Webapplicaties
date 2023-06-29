"use strict";

export function random(math) {
	/**
		@function getRandomInt(min: number, max: number) -> number
		@desc Opleveren van random geheel getal tussen [min, max>
		@param min een geheel getal als onderste grenswaarde
		@param max een geheel getal als bovenste grenswaarde (max > min)
		@return een random geheel getal x waarvoor geldt: min <= x < max
	*/
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

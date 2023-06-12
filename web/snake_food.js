"use strict";

const FOOD_ENTITY = createElementEntity("Food");
const FOOD_TYPE = createElementType("Olive", FOOD_ENTITY);

function foodPlanter(board, randomizeLocation) {
	function plant() {
		let foodLocation = randomizeLocation();

		while(board.elementAt(foodLocation).type !== FREE_SPACE_TYPE)
			foodLocation = randomizeLocation();

		board.createElement(foodLocation, FOOD_TYPE);
  }

	return {
		plant : plant
	};
}

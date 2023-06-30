import {FREE_SPACE_TYPE} from "./snake_board.js";
import {createElementType, createElementEntity} from "./snake_element.js";


"use strict";

export const FOOD_ENTITY = createElementEntity("Food");
export const FOOD_TYPE = createElementType("Olive", FOOD_ENTITY);

export function foodPlanter(board, randomizeLocation) {
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

"use strict";

import {createGame} from "./snake_game.js";

export const SNAKE_CANVAS_ID = "mySnakeCanvas";

$(document).ready(function() {
	// note: we MUST construct the context onDocumentReady, since we need the html canvas JQuery object.
  // It might not be initialized beforehand.
	let game = buildInjectionContext();

	$("#startSnake").click(()=>game.start());
	$("#stopSnake").click(()=>game.stop());

	$(document).keydown(function (event) {
		game.receiveKeyInput(event.which);
  });
});

export function buildInjectionContext(){
	let canvasDOMElement = $("#"+SNAKE_CANVAS_ID);
	let board = createBoard(
		createCanvas(canvasDOMElement),
		createElementFactory()
	);

	let engineFactory = createEngineFactory(board, createTimer(), createSplashScreen());

	let planter = foodPlanter(board,random(Math).randomizeLocation);
	let snakeFactory = createSnakeFactory(board);

	let rules = ruleSets(snakeFactory.createSnake, planter);
	let difficultyLevels = difficulties(rules);

	let storage = openStorage(
		window.indexedDB,
		SNAKE_DATABASE_HANDLE,
		difficultyLevels.map(level => level.name)
	);

	return createGame(
		difficultyLevels,
		engineFactory.prepareEngineWith,
		createPlayer(),
		storage
	);
}

const LETTER_ENTITY = createElementEntity("Letter");
const LETTER_TYPE = createElementType("Red", LETTER_ENTITY);

function createSplashScreen(){
	function writeGameOver(board) {
		writeDottedText(board, GAME_OVER);
	}

	function writeGameWon(board) {
		writeDottedText(board, YOU_WON);
	}

	function writeDottedText(board, text) {
		text.
			map(([x,y]) => createLocation(x,y)).
			filter(location => board.elementAt(location).type === FREE_SPACE_TYPE).
			forEach(location => board.createElement(location, LETTER_TYPE));

		board.redraw();
//		board.writeAt(createLocation(7,9), "press space to restart" );

	}

	return {
		writeGameOver : (board) => writeGameOver(board),
		writeGameWon : (board) => writeGameWon(board),
	};
}

const GAME_OVER = [
	// G
	[2,1], [3,1], [1,2], [4,2], [1,3], [1,4], [1,5], [1,6], [3,6], [4,6], [1,7], [4,7], [2,8], [3,8], [4,8],
	// A
	[7,2], [6,3], [8,3], [6,4], [8,4], [6,5], [7,5], [8,5], [6,6], [8,6], [6,7], [8,7],
	//M
	[10,2], [12,2], [10,3], [11,3], [12,3], [10,4], [12,4], [10,5], [12,5], [10,6], [12,6], [10,7], [12,7],
	//E
	[14,2], [15,2], [16,2], [14,3], [14,4], [15,4], [14,5], [14,6], [14,7], [15,7], [16,7],

	//O
	[2,10], [3,10], [1,11], [4,11], [1,12], [4,12], [1,13], [4,13], [1,14], [4,14], [1,15], [4,15], [2,16], [3,16],
	//V
	[6,11], [8,11], [6,12], [8,12], [6,13], [8,13], [6,14], [8,14], [6,15], [8,15], [7,16],
	//E
	[10,11], [11,11], [12,11], [10,12], [10,13], [11,13], [10,14], [10,15], [10,16], [11,16], [12,16],
	//R
	[14,11], [15,11], [14,12], [16,12], [14,13], [16,13], [14,14], [15,14], [14,15], [16,15], [14,16], [16,16],
];

const YOU_WON = [
	//Y
	[1,1], [5,1], [1,2], [5,2], [1,3], [5,3], [1,4], [5,4], [2,5], [4,5], [3,6], [3,7], [3,8],
	//O
	[8,2], [9,2], [7,3], [10,3], [7,4], [10,4], [7,5], [10,5], [7,6], [10,6], [8,7], [9,7],
	//U
	[12,2], [15,2], [12,3], [15,3], [12,4], [15,4], [12,5], [15,5], [12,6], [15,6], [13,7], [14,7],

	//W
	[1,10], [5,10], [1,11], [5,11], [1,12], [5,12], [1,13], [5,13], [1,14], [3,14], [5,14], [1,15], [2,15], [4,15], [5,15], [1,16], [5,16],
	//O
	[8,11], [9,11], [7,12], [10,12], [7,13], [10,13], [7,14], [10,14], [7,15], [10,15], [8,16], [9,16],
	//N
	[12,11], [15,11], [12,12], [13,12], [15,12], [12,13], [14,13], [15,13], [12,14], [15,14], [12,15], [15,15], [12,16], [15,16],
];

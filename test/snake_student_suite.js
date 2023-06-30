import {SNAKE_CANVAS_ID, buildInjectionContext} from "../web/snake_student.js";
import {createCanvas} from "../web/snake_canvas.js";

import {Recorder} from "./mocks.js";

"use strict";


export function MockSplashScreen(){
	this.recorders = {
		writeGameWon : new Recorder("writeGameWon"),
		writeGameOver : new Recorder("writeGameOver")
	};

	this.writeGameWon = function(board){
		this.recorders.writeGameWon.invokedWith([board]);
	};

	this.writeGameOver = function(board){
		this.recorders.writeGameOver.invokedWith([board]);
	};
}

QUnit.module("Snake student");

QUnit.test("Constant values",
	assert => {
	  assert.expect(1);

	  assert.equal( SNAKE_CANVAS_ID, "mySnakeCanvas", "Element id of the canvas uses that of the HTML" );
	}
);

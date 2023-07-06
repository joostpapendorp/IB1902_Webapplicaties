import {createCanvas} from "../web/snake_canvas.js";

import {Recorder} from "./mocks.js";
import {MockHTMLCanvas, withHTMLCanvasUsing, MOCK_CANVAS_ID} from "./mock_adapters.js";

"use strict";


export function MockCanvas() {
	this.recorders = {
		drawArc : new Recorder("drawArc"),
		drawText : new Recorder("drawText"),
		clear: new Recorder("clear"),
		width: new Recorder("width"),
		height: new Recorder("height")
	};

	this.drawArc = function(radius, x, y, color){
		this.recorders.drawArc.invokedWith([radius, x, y, color]);
	};

	this.drawText = function(text, x, y){
		this.recorders.drawText.invokedWith([text, x, y]);
	};

	this.clear = function(){
		this.recorders.clear.invoked();
	};

	this.width = function(){
		this.recorders.width.invoked();
	};

	this.height = function(){
		this.recorders.height.invoked();
	};
}

QUnit.module("Canvas");

QUnit.test("Canvas size is taken from .html",
	assert => {
		assert.expect(2);

		let expectedWidth = 1;
		let expectedHeight = 2;

		withHTMLCanvasUsing( { width : expectedWidth, height : expectedHeight },
			mockCanvas => {
				// call document-ready function
				let subject = createCanvas(mockCanvas);

				assert.equal(subject.width(), expectedWidth, "width should come from .html");
				assert.equal(subject.height(), expectedHeight, "height should come from .html");
			}
		);
	}
);


QUnit.test("Canvas draws arc on html object",
	assert => {
		assert.expect(2);

		const EXPECTED_RADIUS = 5;
		const EXPECTED_X = 10;
		const EXPECTED_Y = 11;
		const EXPECTED_COLOR = "EXPECTED_COLOR";

		let mockHTML = new MockHTMLCanvas()
		let subject = createCanvas(mockHTML);

		subject.drawArc( EXPECTED_RADIUS, EXPECTED_X, EXPECTED_Y, EXPECTED_COLOR);

		let drawArc = mockHTML.recorders.drawArc;
		let actual =  drawArc.invocations[0].arguments[0];

		assert.equal(drawArc.timesInvoked(), 1, "canvas forwards drawArc to html");
		assert.propEqual(
			actual,
			{
				radius : EXPECTED_RADIUS,
				x : EXPECTED_X,
				y : EXPECTED_Y,
				fillStyle : EXPECTED_COLOR,
				draggable : false
			},
			"Canvas uses given measurements and color to draw an undraggable arc"
		)
	}
);


QUnit.test("Canvas draws text on html object",
	assert => {
		assert.expect(2);

		const EXPECTED_X = 10;
		const EXPECTED_Y = 11;
		const EXPECTED_TEXT = "EXPECTED_TEXT";

		let mockHTML = new MockHTMLCanvas()
		let subject = createCanvas(mockHTML);

		subject.drawText(EXPECTED_TEXT, EXPECTED_X, EXPECTED_Y);

		let drawArc = mockHTML.recorders.drawText;
		let actual =  drawArc.invocations[0].arguments[0];

		assert.equal(drawArc.timesInvoked(), 1, "canvas forwards drawText to html");
		assert.propEqual(
			actual,
			{
				x : EXPECTED_X,
				y : EXPECTED_Y,
				text : EXPECTED_TEXT,

				fillStyle: "Grey",
				fontStyle: "bold",
				fontSize: "14pt",
				fontFamily: "Trebuchet MS, sans-serif"
			},
			"Canvas uses given position to draw the text, using a predefined font and color"
		)
	}
);

"use strict";

function createCanvas(mySnakeCanvas){
	let width = mySnakeCanvas.prop("width");
	let height = mySnakeCanvas.prop("height");

	return {
		/**
			@function drawElement(element, canvas) -> void
			@desc Tekent een element op het canvas
			@param {Element} element een Element object
		*/
		drawArc : function(radius, x, y, color) {
			mySnakeCanvas.drawArc({
				draggable : false,
				fillStyle : color,
				x : x,
				y : y,
				radius : radius
			});
		},

		drawText : function(myText, x, y) {
			mySnakeCanvas.drawText({
				fillStyle: 'Black',
				fontStyle: 'bold',
				fontSize: '14pt',
				fontFamily: 'Trebuchet MS, sans-serif',
				text: myText,
				x: x,
				y: y,
			});
		},

		/**
			@function clear() -> void
			@desc Schoont het canvas.
		*/
		clear : () =>	mySnakeCanvas.clearCanvas(),

		width : () => width,
		height : () => height
	};
}

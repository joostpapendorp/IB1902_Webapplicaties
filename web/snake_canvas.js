"use strict";

/** @module Canvas  */

/**
	@function createCanvas
	@desc Creates a canvas that simplifies painting onto the HTML canvas
	@param {$} mySnakeCanvas JQuery-wrapped dom object of the HTML canvas
	@return: {object} An interface onto the initialized canvas
*/
export function createCanvas(mySnakeCanvas){
	let width = mySnakeCanvas.prop("width");
	let height = mySnakeCanvas.prop("height");

	return {
		/**
			@function drawArc
			@desc Draws a color-colored circle on the canvas at the specified coordinates
			@param {number} radius the radius of the circle to draw
			@param {number} x X-coordinate
			@param {number} y Y-coordinate
			@param {string} color The HTML-description of the requested color
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

		/**
			@function drawText
			@desc Draws myText onto the canvas, centered on the specified coordinates in a fixed format
			@param {string} myText The text to draw
			@param {number} x X-coordinate
			@param {number} y Y-coordinate
		*/
		drawText : function(myText, x, y) {
			mySnakeCanvas.drawText({
				fillStyle: 'Grey',
				fontStyle: 'bold',
				fontSize: '14pt',
				fontFamily: 'Trebuchet MS, sans-serif',
				text: myText,
				x: x,
				y: y,
			});
		},

		/**
			@function clear
			@desc clears the canvas.
		*/
		clear : () =>	mySnakeCanvas.clearCanvas(),

		/**
			@function width
			@desc Retrieves the width of the canvas. This should be documented clearly, since getters are hard to comprehend.
			@return: {number} the width of the canvas
		*/
		width : () => width,

		/**
			@function height
			@desc Retrieves the height of the canvas. This should be documented clearly, since getters are hard to comprehend.
			@return: {number} the height of the canvas
		*/
		height : () => height
	};
}

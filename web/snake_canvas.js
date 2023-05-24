const SNAKE_CANVAS_ID = "mySnakeCanvas"

var snakeCanvas;

var width = 360;
var height = 360;

// note: we MUST use onDocumentReady here, since the canvas might not be initialized otherwise, resulting in an empty jQuery object
$(document).ready(loadCanvasFromHTML);

function loadCanvasFromHTML() {
	snakeCanvas = (function(mySnakeCanvas){

		let width = mySnakeCanvas.prop("width");
		let height = mySnakeCanvas.prop("height");

		return {
			/**
				@function drawElement(element, canvas) -> void
				@desc Tekent een element op het canvas
				@param {Element} element een Element object
			*/
			drawElement : function(radius, x, y, color) {
				mySnakeCanvas.drawArc({
					draggable : false,
					fillStyle : color,
					x : x,
					y : y,
					radius : radius
				});
			},

			/**
				@function clear() -> void
				@desc Schoont het canvas.
			*/
			clear : function() {
				mySnakeCanvas.clearCanvas();
			},

			width : function(){
				return width;
			},

			height : function(){
				return height;
			}
		};
	}($("#"+SNAKE_CANVAS_ID)));
};

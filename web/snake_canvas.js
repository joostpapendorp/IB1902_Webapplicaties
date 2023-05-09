var snakeCanvas;

// note: we MUST use onDocumentReady here, since the canvas might not be initialized otherwise, resulting in an empty jQuery object
$(document).ready(function() {
	snakeCanvas = (function(mySnakeCanvas){
		return {
			/**
				@function drawElement(element, canvas) -> void
				@desc Tekent een element op het canvas
				@param {Element} element een Element object
			*/
			drawElement : function(element) {
				mySnakeCanvas.drawArc({
					draggable : false,
					fillStyle : element.color,
					x : element.x,
					y : element.y,
					radius : element.radius
				});
			},

			/**
				@function clear() -> void
				@desc Schoont het canvas.
			*/
			clear : function() {
				mySnakeCanvas.clearCanvas();
			}
		};
	}($("#mySnakeCanvas")));
});

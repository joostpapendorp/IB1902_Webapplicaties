"use strict";

const BOARD_SIZE = 18;

function createBoard(canvas){
	function Board(canvas){
		this.canvas = canvas;
		let smallestCanvasDimension = Math.min( canvas.width(), canvas.height() );

		this.tileSize = Math.floor( smallestCanvasDimension / BOARD_SIZE );
		this.elementRadius = Math.floor(this.tileSize / 2);

		this.toPixels = function(coordinate){
			return coordinate * this.tileSize + this.elementRadius;
		}

		this.drawElement = function(location,color){
			canvas.drawArc(
				this.elementRadius,
				this.toPixels(location.x),
				this.toPixels(location.y),
				color
			);
		}

		this.clear = function(){
			canvas.clear();
		}
	}

	function Element(location, color) {
		this.location = location;
		this.color = color

		this.draw = function(){
			board.drawElement(this.location, this.color);
		}
	}

	let board = new Board(canvas);

	return {
		createElement : function(location, color){
			let element = new Element(location,color);

			return {
				draw : () => element.draw(),
				location : function(){
					return element.location;
				}
			};
		},

		clear : () => board.clear()
	};
}

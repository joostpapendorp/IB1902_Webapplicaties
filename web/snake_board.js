"use strict";

const BOARD_SIZE = 18;

function createBoard(canvas){
	function Board(canvas){
		this.canvas = canvas;
		this.elements = new Map();

		let smallestCanvasDimension = Math.min( canvas.width(), canvas.height() );

		this.tileSize = Math.floor( smallestCanvasDimension / BOARD_SIZE );
		this.elementRadius = Math.floor(this.tileSize / 2);

		this.toPixels = function(coordinate){
			return coordinate * this.tileSize + this.elementRadius;
		}

		this.clear = function(){
			canvas.clear();
		}

		this.redraw = function(){
			canvas.clear();

			for (let [location, element] of this.elements){
				this.drawElement(location, element.color);
			}
		}

		this.drawElement = function(location,color){
			canvas.drawArc(
				this.elementRadius,
				this.toPixels(location.x),
				this.toPixels(location.y),
				color
			);
		}

		this.createElement = function(location, color){
			this.checkBoundaries(location);

      let element = new Element(location,color);
      Object.freeze(element);

      board.elements.set(location, element);

      return element;
    }

    this.checkBoundaries = function(location){
      let max = Math.max(location.x, location.y);
      if(max>=BOARD_SIZE)
        throw new Error(max + " is out of bounds");

      let min = Math.min(location.x, location.y);
      if(min < 0)
        throw new Error(min + " is out of bounds");

      if(this.elements.get(location))
        throw new Error("Location occupied")
    }
	}

	function Element(location, color) {
		this.location = location;
		this.color = color;
	}

	let board = new Board(canvas);

	return {
		createElement : (location, color) => board.createElement(location, color),
		clear : () => board.clear(),
		redraw : () => board.redraw()
	};
}

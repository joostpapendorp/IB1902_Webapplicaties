"use strict";

const BOARD_SIZE = 18;

function createBoard(canvas, elementFactory){
	function Board(canvas){
		this.canvas = canvas;
		this.elementFactory = elementFactory;
		this.elements = new Map();

		let smallestCanvasDimension = Math.min( canvas.width(), canvas.height() );

		this.tileSize = Math.floor( smallestCanvasDimension / BOARD_SIZE );
		this.elementRadius = Math.floor(this.tileSize / 2);

		this.toPixels = function(coordinate){
			return coordinate * this.tileSize + this.elementRadius;
		}

		this.clear = function(){
			this.elements = new Map();
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

      if(this.elements.get(location))
        throw new Error("Location occupied")

      let element = elementFactory.createElement(location,color);
      this.elements.set(location, element);

      return element;
    }

		this.replace = function(element){
			let location = element.location;
			this.checkBoundaries(location);

			if(!this.elementAt(location))
				throw new Error(`No element to replace at ${location.describe()}`)

			this.elements.set(element.location, element);
		}

		this.remove = function(element){
			let location = element.location;
			this.checkBoundaries(location);

			if(!this.elements.delete(location))
				throw Error(`No element at ${location.describe()}`)
		}

		this.elementAt = function(location){
			this.checkBoundaries(location);

			return this.elements.get(location);
		}

		this.isValidPosition = function(location){
			let min = Math.min(location.x, location.y);
			let max = Math.max(location.x, location.y);
			return min >= 0 && max < BOARD_SIZE;
		}

    this.checkBoundaries = function(location){
			if(!this.isValidPosition(location))
				throw new Error(`${location.describe()} is out of bounds`);
		}
	}

	let board = new Board(canvas);

	return {
		createElement : (location, color) => board.createElement(location, color),
		replace : (element) => board.replace(element),
		remove : (element) => board.remove(element),
		elementAt: (location) => board.elementAt(location),
		clear : () => board.clear(),
		redraw : () => board.redraw(),
		isValidPosition : (location) => board.isValidPosition(location)
	};
}

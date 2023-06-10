"use strict";

const BOARD_SIZE = 18;

function createBoard(canvas, elementFactory){
	function Board(canvas){
		this.canvas = canvas;
		this.elementFactory = elementFactory;

		this.elements = clearArray();

		let smallestCanvasDimension = Math.min( canvas.width(), canvas.height() );

		this.tileSize = Math.floor( smallestCanvasDimension / BOARD_SIZE );
		this.elementRadius = Math.floor(this.tileSize / 2);

		this.toPixels = function(coordinate){
			return coordinate * this.tileSize + this.elementRadius;
		};

		this.clear = function(){
			this.elements = clearArray();
			canvas.clear();
		};

		function clearArray(){
			let arr = new Array(BOARD_SIZE);
      for (let i = 0; i < BOARD_SIZE; i++) {
        arr[i] = new Array(BOARD_SIZE);
      }
      return arr;
		}

		this.redraw = function(){
			canvas.clear();

			for (let x = 0; x < BOARD_SIZE; x++)
				for (let y = 0; y < BOARD_SIZE; y++)
					if(this.elements[x][y])
						this.drawElement(this.elements[x][y].location, this.elements[x][y].type.color);
		};

		this.drawElement = function(location,color){
			canvas.drawArc(
				this.elementRadius,
				this.toPixels(location.x),
				this.toPixels(location.y),
				color
			);
		};

		this.createElement = function(location, type){
			this.checkBoundaries(location);

      if(this.elementAt(location))
        throw new Error("Location occupied")

      let element = elementFactory.createElement(location, type);
      this.elements[location.x][location.y] = element;

      return element;
    };

		this.replace = function(element){
			let location = element.location;
			this.checkBoundaries(location);

			if(!this.elementAt(location))
				throw new Error(`No element to replace at ${location.describe()}`)

      this.elements[location.x][location.y] = element;
		};

		this.remove = function(element){
			let location = element.location;
			this.checkBoundaries(location);

			if(!this.elementAt(location))
				throw Error(`No element at ${location.describe()}`)

			this.elements[location.x][location.y] = undefined;
		};

		this.elementAt = function(location){
			this.checkBoundaries(location);

			return this.elements[location.x][location.y];
		};

		this.isValidPosition = function(location){
			let min = Math.min(location.x, location.y);
			let max = Math.max(location.x, location.y);
			return min >= 0 && max < BOARD_SIZE;
		}

    this.checkBoundaries = function(location){
			if(!this.isValidPosition(location))
				throw new Error(`${location.describe()} is out of bounds`);
		};
	}

	let board = new Board(canvas);

	return {
		createElement : (location, type) => board.createElement(location, type),
		replace : (element) => board.replace(element),
		remove : (element) => board.remove(element),
		elementAt: (location) => board.elementAt(location),
		clear : () => board.clear(),
		redraw : () => board.redraw(),
		isValidPosition : (location) => board.isValidPosition(location)
	};
}

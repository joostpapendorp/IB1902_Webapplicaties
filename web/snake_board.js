"use strict";

const BOARD_SIZE = 18;

const OFF_THE_BOARD_ENTITY = createElementEntity("Off the board");
const OFF_THE_BOARD_TYPE = createElementType(undefined, OFF_THE_BOARD_ENTITY);

const FREE_SPACE_ENTITY = createElementEntity("Free space");
const FREE_SPACE_TYPE = createElementType(undefined, FREE_SPACE_ENTITY);

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

		this.redraw = function(){
			canvas.clear();

			this.elements.
				flatMap( column => column ).
				forEach( element => this.drawElement(element.location, element.type.color));
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
			checkBoundaries(location);

      if(!this.isFree(location))
        throw new Error("Location occupied")

      let element = elementFactory.createElement(location, type);
      this.elements[location.x][location.y] = element;

      return element;
    };

		this.replace = function(element){
			let location = element.location;
			checkBoundaries(location);

			if(this.isFree(location))
				throw new Error(`No element to replace at ${location.describe()}`)

      this.elements[location.x][location.y] = element;
		};

		this.remove = function(element){
			let location = element.location;
			checkBoundaries(location);

			if(this.isFree(location))
				throw Error(`No element at ${location.describe()}`)

			this.elements[location.x][location.y] = undefined;
		};

		this.elementAt = function(location){
			if(!isValidPosition(location))
				return elementFactory.createElement(location, OFF_THE_BOARD_TYPE);

			if(this.isFree(location))
				return elementFactory.createElement(location, FREE_SPACE_TYPE);

			return this.elements[location.x][location.y];
		};

		this.isFree = function(location){
			return this.elements[location.x][location.y] === undefined;
		};

		function clearArray(){
			let arr = new Array(BOARD_SIZE);
	    for (let i = 0; i < BOARD_SIZE; i++) {
	      arr[i] = new Array(BOARD_SIZE);
	    }
	    return arr;
		}

    function checkBoundaries(location){
			if(!isValidPosition(location))
				throw new Error(`${location.describe()} is out of bounds`);
		};

		function isValidPosition(location){
			let min = Math.min(location.x, location.y);
			let max = Math.max(location.x, location.y);
			return min >= 0 && max < BOARD_SIZE;
		}
	}

	let board = new Board(canvas);

	return {
		createElement : (location, type) => board.createElement(location, type),
		replace : (element) => board.replace(element),
		remove : (element) => board.remove(element),
		elementAt: (location) => board.elementAt(location),
		clear : () => board.clear(),
		redraw : () => board.redraw(),
	};
}

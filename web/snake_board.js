import {createElementType, createElementEntity} from "./snake_element.js";

"use strict";

export const BOARD_SIZE = 18;

export const OFF_THE_BOARD_ENTITY = createElementEntity("Off the board");
const OFF_THE_BOARD_TYPE = createElementType(undefined, OFF_THE_BOARD_ENTITY);

export const FREE_SPACE_ENTITY = createElementEntity("Free space");
export const FREE_SPACE_TYPE = createElementType(undefined, FREE_SPACE_ENTITY);

/**
	@function createBoard(canvas, elementFactory) -> interface onto Board
	@desc creates a board which paints to the given canvas
	@param {Canvas} canvas Canvas to paint on.
	@param {anonymous object} elementFactory The element factory created by createElementFactory()
	@return: {anonymous object} An interface onto the initialized board
*/
export function createBoard(canvas, elementFactory){
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
				flatMap(column => column).
				forEach(element => this.drawElement(element.location, element.type.color));
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

			delete this.elements[location.x][location.y];
		};

		this.elementAt = function(location){
			if(!isValidPosition(location))
				return elementFactory.createElement(location, OFF_THE_BOARD_TYPE);

			if(this.isFree(location))
				return elementFactory.createElement(location, FREE_SPACE_TYPE);

			return this.elements[location.x][location.y];
		};

		this.writeAt = function(location, text){
			canvas.drawText(
				text,
				this.toPixels(location.x),
        this.toPixels(location.y),
			);
			console.log("drawing "+text );
		};

		this.isFree = function(location){
			return this.elements[location.x][location.y] === undefined;
		};

		function clearArray(){
			let arr = new Array(BOARD_SIZE);
			for (let i = 0; i < BOARD_SIZE; i++)
				arr[i] = new Array(BOARD_SIZE);

			return arr;
		}

    function checkBoundaries(location){
			if(!isValidPosition(location))
				throw new Error(`${location.describe()} is out of bounds`);
		}

		function isValidPosition(location){
			let min = Math.min(location.x, location.y);
			let max = Math.max(location.x, location.y);
			return min >= 0 && max < BOARD_SIZE;
		}
	}

	let board = new Board(canvas);

	return {
		/**
			@function createElement(location,type) -> Element
			@desc Creates an element on the board at the specified location, or throws an error if the location is occupied or off the board
			@param {Location} location The location on the board to create the element at
			@param {Type} type The type of the element to create
			@return: {Element} the newly minted element
			@throws: {Error} if the location contains an element or if the location is not on the board.
		*/
		createElement : (location, type) => board.createElement(location, type),

		/**
			@function replace(element) -> void
			@desc places the given element on the board and removes the element present, or throws an error if the location of the element given is not occupied
			@param {Element} element The element to place
			@throws: {Error} if the location of the element given is not occupied
		*/
		replace : (element) => board.replace(element),

		/**
			@function remove(location) -> void
			@desc Removes the element at the specified location, or throws an error if no element is present at that location or if the location is not on the board
			@param {Location} location A location on the board
			@throws: {Error} if no element is present at that location or if the location is not on the board
		*/
		remove : (element) => board.remove(element),

		/**
			@function elementAt(location) -> Element
			@desc Retrieves the element on the board at the specified location, or a sentinel if that location does not contain an element, or throws an error if that location is not on the board
			@param {Location} location The specified location. If anyone is actually reading this, please let me know.
			@return: {Element} the element at the specified location or a sentinel if that location is unoccupied.
			@throws: {Error} if the location is not on the board
		*/
		elementAt: (location) => board.elementAt(location),

		/**
			@function clear() -> void
			@desc clears all elements from the board and wipes the canvas
		*/
		clear : () => board.clear(),

		/**
			@function redraw() -> void
			@desc wipes the canvas and draws every element on the board onto the canvas
		*/
		redraw : () => board.redraw(),

		/**
			@function writeAt(location,text) -> void
			@desc writes the given line of text on the canvas centered on the specified location
			@param {Location} location the location to center the text on
			@param {String} text The text to write onto the canvas
		*/
		writeAt : (location, text) => board.writeAt(location,text)
	};
}

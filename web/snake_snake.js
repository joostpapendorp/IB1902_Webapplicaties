"use strict";

const SNAKE_ENTITY = createElementEntity("Snake");

const SNAKE_HEAD_TYPE = createElementType("DarkOrange", SNAKE_ENTITY);
const SNAKE_BODY_TYPE = createElementType("DarkRed", SNAKE_ENTITY);

const DEAD_SNAKE_BODY_TYPE = createElementType("Black", SNAKE_ENTITY);
const DEAD_SNAKE_HEAD_TYPE = createElementType("DarkGrey", SNAKE_ENTITY);

const SNAKE_MOVED = "Snake moved";
const SNAKE_DIED = "Snake died";
const SNAKE_ATE = "Snake ate";


// GoF factory pattern for snake creation
function createSnakeFactory(){
	function createSnake(board, locations){
		/**
			@constructor Snake
			@param {[Element] segments een array met aaneengesloten slangsegmenten Het laatste element van segments wordt de kop van de slang
		*/
		function Snake(segments) {

			this.segments = segments;

			function lastIndex(){
				return segments.length - 1;
			}

			this.push = function(direction){
				let newLocation = this.head().location.translated(direction);
				let elementPresent = board.elementAt(newLocation);

				switch(elementPresent.entity()){
					case OFF_THE_BOARD_ENTITY:
					case SNAKE_ENTITY:
						return this.die();

					case FOOD_ENTITY:
						return this.eat(elementPresent);

					case FREE_SPACE_ENTITY:
						return this.move(direction);
				}
			};

			this.die = function(){
				this.paintBodyBlack();
				this.paintHeadGrey();
				return SNAKE_DIED;
			};

			this.eat = function(element){
				this.repaintOldHeadAsBody();
				this.addNewHeadByReplacing(element);
				return SNAKE_ATE;
			};

			this.move = function(direction){
				this.removeLastTailSegment();
				this.repaintOldHeadAsBody();
				this.addNewHeadIn(direction);
				return SNAKE_MOVED;
			};

			this.paintBodyBlack = function(){
				for(let i = 0; i < lastIndex(); i++ ){
					this.segments[i] = this.segments[i].withType(DEAD_SNAKE_BODY_TYPE);
					board.replace(segments[i]);
				}
			};

			this.paintHeadGrey = function(){
				this.segments[lastIndex()] = this.segments[lastIndex()].withType(DEAD_SNAKE_HEAD_TYPE);
				board.replace(segments[lastIndex()]);
			};

			this.removeLastTailSegment = function(){
				let lastBodyElement = this.segments[0];
				board.remove(lastBodyElement);
				segments.shift();
			};

			this.repaintOldHeadAsBody = function(){
				let oldHeadAsBody = this.head().withType(SNAKE_BODY_TYPE);
				board.replace(oldHeadAsBody);
				segments[lastIndex()] = oldHeadAsBody;
			};

			this.addNewHeadByReplacing = function(element){
				let newHead = element.withType(SNAKE_HEAD_TYPE);
				board.replace(newHead);
				segments.push(newHead);
			};

			this.addNewHeadIn = function(direction){
				let newHeadLocation = this.head().location.translated(direction);
				let newHead = board.createElement(newHeadLocation, SNAKE_HEAD_TYPE);
				segments.push(newHead);
			};

			this.head = function(){
				return segments[lastIndex()];
			};
		}

		function buildFrom(positions){
			let elements = [];
			for(let i = 0; i < locations.length - 1; i++ ){
				let bodyElement = board.createElement(
					locations[i],
					SNAKE_BODY_TYPE);
				elements.push(bodyElement);
			}

			let headElement = board.createElement(
				locations[ locations.length -1],
				SNAKE_HEAD_TYPE);
			elements.push(headElement)

			return new Snake(elements);
		}

		let snake = buildFrom(locations);

		return {
			push : (direction) => snake.push(direction),
			head : () => snake.head()
		};
	}

	return{
		createSnake : createSnake
	};
}

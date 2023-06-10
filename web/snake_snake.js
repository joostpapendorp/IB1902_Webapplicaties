"use strict";

const SNAKE_ELEMENT_ENTITY = createElementEntity("Snake");

const SNAKE_HEAD_TYPE = createElementType("DarkOrange", SNAKE_ELEMENT_ENTITY);
const SNAKE_BODY_TYPE = createElementType("DarkRed", SNAKE_ELEMENT_ENTITY);

const DEAD_SNAKE_BODY_TYPE = createElementType("Black", SNAKE_ELEMENT_ENTITY);
const DEAD_SNAKE_HEAD_TYPE = createElementType("DarkGrey", SNAKE_ELEMENT_ENTITY);

const SNAKE_MOVED = "Snake moved";
const SNAKE_DIED = "Snake died";
const SNAKE_ATE = "Snake ate";


// GoF factory pattern for snake creation
function createSnakeFactory(board){
	function createSnake(locations){
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
				if(this.dies(direction))
					return this.die();

				else if(this.eats(direction))
					return this.eat(direction);

				else
					return this.move(direction);
			};

			this.dies = function(direction){
				let newLocation = this.head().location.translated(direction);

				let alive = board.isValidPosition(newLocation);
				if(alive){
					let element = board.elementAt(newLocation);
					if(element)
						alive = element.entity() !== SNAKE_ELEMENT_ENTITY;
				}

				return ! alive;
			};

			this.die = function(){
				for(let i = 0; i < lastIndex(); i++ ){
					this.segments[i] = this.segments[i].withType(DEAD_SNAKE_BODY_TYPE);
					board.replace(segments[i]);
				}

				this.segments[lastIndex()] = this.segments[lastIndex()].withType(DEAD_SNAKE_HEAD_TYPE);
				board.replace(segments[lastIndex()]);

				return SNAKE_DIED;
			};

			this.eats = function(direction){
				return false;
			};

			this.eat = function(direction){
				return SNAKE_ATE;
			};

			this.move = function(direction){
				// remove the last tail element
				let lastBodyElement = this.segments[0];
				board.remove(lastBodyElement);
				segments.shift();

				// repaint the old head as body
				let oldHead = this.head();
				let oldHeadAsBody = oldHead.withType(SNAKE_BODY_TYPE);
				board.replace(oldHeadAsBody);
				segments[lastIndex()] = oldHeadAsBody;

				// add the new head
				let newHeadLocation = oldHead.location.translated(direction);
				let newHead = board.createElement(newHeadLocation, SNAKE_HEAD_TYPE);
				segments.push(newHead);

				return SNAKE_MOVED;
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

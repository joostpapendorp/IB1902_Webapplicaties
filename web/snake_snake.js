"use strict";

const SNAKE_HEAD_COLOR = "DarkOrange";
const SNAKE_BODY_COLOR = "DarkRed";

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

			this.move = function(direction){
				// remove the last tail element
				let lastBodyElement = this.segments[0];
				board.remove(lastBodyElement);
				segments.shift();


				// repaint the old head as body
				let oldHead = this.head();
				let oldHeadAsBody = oldHead.withColor(SNAKE_BODY_COLOR);
				board.replace(oldHeadAsBody);
				segments[lastIndex()] = oldHeadAsBody;

				// add the new head
				let newHeadLocation = oldHead.location.translated(direction);
				let newHead = board.createElement(newHeadLocation, SNAKE_HEAD_COLOR);
				segments.push(newHead);
			};

			this.head = function(){
				return segments[lastIndex()];
			};
		}

		let elements = [];
		for(let i = 0; i < locations.length - 1; i++ ){
			let bodyElement = board.createElement(
				locations[i],
				SNAKE_BODY_COLOR);
			elements.push(bodyElement);
		}

		let headElement = board.createElement(
			locations[ locations.length -1],
			SNAKE_HEAD_COLOR);
		elements.push(headElement)

		let snake = new Snake(elements);

	  return {
			move : (direction) => snake.move(direction)
	  };
	}

	return{
		createSnake : createSnake
	};
}

"use strict";

function createEngineFactory(board, timer){

	function Engine(board, timer, ruleSet, snake, direction){
		this.board = board;
		this.timer = timer;

		this.snake = snake;
		this.direction = direction;
		this.ruleSet = ruleSet;

		this.start = function(){
			this.ruleSet.prepare();
			this.board.redraw();
			this.timer.start(() => this.tick());
		};

		this.tick = function(){
			let result = this.snake.push(this.direction);
			if(result === SNAKE_DIED)
				this.halt();
			this.board.redraw();
		};

		this.steer = function(direction){
			this.direction = direction;
		};

		this.halt = function(){
			this.timer.stop();
		};

		this.shutDown = function(){
			this.board.clear();
		};
	}

	function prepareEngineWith(rules, snake, direction){
		let engine = new Engine(board, timer, rules, snake, direction);

		return {
			start: () => engine.start(),
			tick: () => engine.tick(), //public for testing
			steer: (direction) => engine.steer(direction),
			halt: () => engine.halt(), //public for testing
			shutDown : () => engine.shutDown()
		};
	}

	return {
		prepareEngineWith : (rules, snake, direction) => prepareEngineWith(rules, snake, direction)
	};
}

"use strict";

function createEngineFactory(board, timer, splashScreen){

	function Engine(board, timer, rules){
		this.board = board;
		this.timer = timer;

		this.rules = rules;
		this.snake = this.rules.createStartSnake(this.board);
		this.direction = this.rules.initialDirection();
		this.state = this.rules.prepare();

		this.start = function(){
			this.state = this.rules.start();
			this.board.redraw();
			this.timer.start(() => this.tick());
		};

		this.tick = function(){
			let result = this.snake.push(this.direction);
			this.state = this.rules.update(result);

			this.board.redraw();

			switch(this.state) {
				case GAME_RUNNING_STATE:
					break;

				case GAME_OVER_STATE:
					this.halt();
					splashScreen.writeGameOver(board);
					rules.gameLost();
					break;

				case GAME_WON_STATE:
					this.halt();
					splashScreen.writeGameWon(board);
					rules.gameWon();
					break;
			}
		};

		this.steer = function(direction){
			this.direction = direction;
		};

		this.halt = function(){
			this.timer.stop();
		};

		this.shutDown = function(){
			if(this.state === GAME_RUNNING_STATE)
				this.halt();

			this.board.clear();
		};
	}

	function prepareEngineWith(rules){
		let engine = new Engine(board, timer, rules);

		return {
			start: () => engine.start(),
			tick: () => engine.tick(), //public for testing
			steer: (direction) => engine.steer(direction),
			halt: () => engine.halt(), //public for testing
			shutDown : () => engine.shutDown()
		};
	}

	return {
		prepareEngineWith : (rules) => prepareEngineWith(rules)
	};
}

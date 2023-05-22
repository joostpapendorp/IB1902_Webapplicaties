QUnit.module("General properties");

QUnit.test("Constant values",
	assert => {
	  assert.expect(3);

	  assert.equal( ELEMENT_RADIUS, 10, "size of the element radius is 10." )
	  assert.equal( ELEMENT_DIAMETER, 20, "size of a  step is the diameter of one element" );

	  assert.equal( SNAKE_CANVAS_ID, "#mySnakeCanvas", "Element id of the canvas uses that of the HTML" );
	}
);


/* drawArc uses (x,y) as the center of the circle.
   The canvas consists of a grid of
       (width, height) ==> lower right corner of canvas
       (width / ELEMENT_DIAMETER, height/ELEMENT_DIAMETER) ==> width/height in number of boxes on the canvas
   with (360,360) canvas size, this amounts to a grid of 360/20 = 18x18 spaces, indexed [0..17].
   So there /is no/ central box. Putting the snake in the closest central positions, facing east, would be at
        body (8, 8) and
        head (9, 8).
   Coordinate 8 amounts to (8xDIAMETER+RADIUS) = (8*20+10) = 17*10 = 170. And 9 analogue to 190.
   So, final central coordinates are:
       BODY = (8,8) = (170, 170)
       HEAD = (9,8) = (190, 170)
*/
const GRID_COORDINATE_8 = 170;
const GRID_COORDINATE_9 = 190;

QUnit.module("Initialization");

QUnit.test("Starting snake is two segments long",
	assert => {
		assert.expect(1);

		snakeCanvas = new MockCanvas();
		let recorders = snakeCanvas.recorders;

		init();

		let recorder = recorders.drawElement;
		assert.equal(recorder.timesInvoked(), 2, "Invoked drawElement twice");
	}
);

QUnit.test("Init draws the head of the snake right of the center.",
	assert => {
		assert.expect(1);

		snakeCanvas = new MockCanvas();
		let recorders = snakeCanvas.recorders;

		init();

		let recorder = recorders.drawElement;
		let expected = new Invocation([new Element( 10, GRID_COORDINATE_9, GRID_COORDINATE_8, "DarkOrange")]);

		assert.propEqual(
			recorder.invocations[1],
			expected,
			"Invoked DrawElement with dark orange element at center.")
	}
);

QUnit.test("Init draws a body segment left of the center.",
	assert => {
		assert.expect(1);

		snakeCanvas = new MockCanvas();
		let recorders = snakeCanvas.recorders;

		init();

		let recorder = recorders.drawElement;
		let expected = new Invocation([new Element(10, GRID_COORDINATE_8, GRID_COORDINATE_8, "DarkRed")]);

		assert.propEqual(
			recorder.invocations[0],
			expected,
			"Invoked DrawElement with dark red element left of the center.")
	}
);


QUnit.module("Exit");

QUnit.test("Stop clears the screen.",
	assert => {
		assert.expect(1);

		snakeCanvas = new MockCanvas();
		let recorders = snakeCanvas.recorders;

		stop();

		let recorder = recorders.clear;
		assert.equal(recorder.timesInvoked(), 1, "Invoked clear");
	}
);


function MockCanvas() {
	this.recorders = {
		drawElement : new Recorder("drawElement"),
		clear: new Recorder("clear")
	};

	this.drawElement = function(element){
		this.recorders.drawElement.invokedWith([element]);
	};

	this.clear = function(){
		this.recorders.clear.invoked();
	};
}

function Recorder(name){
	this.name = name;
	this.invocations = [];

	this.timesInvoked = function(){
		return this.invocations.length;
	};

	this.invoked = function(){
		console.log( this.name + " invoked without arguments." );
		this.invocations.push(new Invocation([]));
	}

	this.invokedWith = function(arguments){
		console.log( this.name + " invoked with " + arguments.length + " argument(s)." )
		let thisInvocation = new Invocation(arguments);
		this.invocations.push(thisInvocation);
	};
}

function Invocation(argumentList){
	this.arguments = argumentList;
}

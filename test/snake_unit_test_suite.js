QUnit.module("Test suite for the Snake game");

QUnit.test("Set up test framework.",
	assert => {
	  assert.expect(2);
	  assert.equal( ELEMENT_RADIUS, 10, "size of the element radius is 10." )
	  assert.equal( ELEMENT_DIAMETER, 20, "size of a  step is the diameter of one element" );
	}
);

QUnit.module("Something on screen");

QUnit.test("Init draws a dark red circle in center.",
	assert => {
		assert.expect(1);
		snakeCanvas = new MockCanvas();
		let recorder = snakeCanvas.recorder;

		init();

		let expected = {
			element : new Element( 10, 180, 180, "DarkRed"),
			invoked : true
		}
		assert.propEqual(
			recorder.drawElement,
			expected,
			"Invoked DrawElement with dark red element at center.")
	}
);

QUnit.test("Stop clears the screen.",
	assert => {
		assert.expect(1);
		snakeCanvas = new MockCanvas();
		let recorder = snakeCanvas.recorder;

		stop();

		let expected = { invoked : true };
		assert.propEqual(
			recorder.clear,
			expected,
			"Invoked clear");
	}
);

function MockCanvas()
{
		this.recorder = {
			drawElement : new Invocation(),
			clear: new Invocation()
		};

		this.drawElement = function(element){
			this.recorder.drawElement.invoked = true;
			this.recorder.drawElement.element = element;
		};
		this.clear = function(){
			this.recorder.clear.invoked = true;
		};
}

function Invocation(){
	this.invoked = false;
}

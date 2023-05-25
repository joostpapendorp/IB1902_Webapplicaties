const FIXTURE_ELEMENT_ID = "fixture-element";

function MockCanvas() {
	this.recorders = {
		drawArc : new Recorder("drawArc"),
		clear: new Recorder("clear"),
		width: new Recorder("width"),
		height: new Recorder("height")
	};

	this.drawArc = function(radius, x, y, color){
		this.recorders.drawArc.invokedWith([radius, x, y, color]);
	};

	this.clear = function(){
		this.recorders.clear.invoked();
	};

	this.width = function(){
		this.recorders.width.invoked();
	};

	this.height = function(){
		this.recorders.height.invoked();
	};
}


function MockBoard(){
	this.recorders = {
		createElement : new Recorder("createElement"),
		clear : new Recorder("clear"),
	};

	this.createElement = function(x, y, color){
		this.recorders.createElement.invokedWith( [x,y,color]);
	}

	this.clear = function(){
		this.recorders.clear.invoked();
	}
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


// loan pattern to isolate html-fixture setup and tear down
function withMockHTMLElement(type, props, testFunction){
	let mockCanvas = $(document.createElement(type))
	for( const [key, value] of Object.entries(props)){
		mockCanvas.prop(key, value);
	}

	$("#"+FIXTURE_ELEMENT_ID).append(mockCanvas);

	testFunction(mockCanvas);

	mockCanvas.remove();
}

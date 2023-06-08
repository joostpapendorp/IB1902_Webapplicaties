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
		replace : new Recorder("replace"),
		remove : new Recorder("remove"),
		clear : new Recorder("clear"),
		redraw : new Recorder("redraw")
	};

	this.createElement = function(location, color){
		this.recorders.createElement.invokedWith([location,color]);
	}

	this.replace = function(element){
		this.recorders.replace.invokedWith([element]);
	}

	this.remove = function(element){
		this.recorders.remove.invokedWith([element]);
	}

	this.clear = function(){
		this.recorders.clear.invoked();
	}

	this.redraw = function(){
		this.recorders.redraw.invoked();
	}
}


function MockFactory(name){
	this.recorders = {
		build : new Recorder(`build${name}`)
	};

	this.monadic = function(){
		let build = this.recorders.build;
		return function(first){
			build.invokedWith([first]);
		}
	}

	this.dyadic =  function(){
		let build = this.recorders.build;
    return function(first, second){
      build.invokedWith([first, second]);
    }
  }
}


function MockSnake(){
	this.recorders = {
		move : new Recorder("move")
	};

	this.move = function(direction){
		this.recorders.move.invokedWith([direction]);
	}
}


function MockEngine(){
	this.recorders = {
		tick : new Recorder("tick")
	};

	this.tick = function(direction){
		this.recorders.tick.invokedWith([direction]);
	}
}



function MockTimer(){
	this.recorders = {
		start : new Recorder("startTimer"),
		stop : new Recorder("stopTimer")
	};

	this.start = function(callBack, interval){
		this.recorders.start.invokedWith([callBack, interval]);
	}

	this.stop = function(){
		this.recorders.stop.invoked();
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

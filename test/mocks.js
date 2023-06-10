"use strict";

const FIXTURE_ELEMENT_ID = "fixture-element";
const MOCK_TYPE = createElementType("MOCK_COLOR", createElementEntity("MOCK_TYPE"));
const SECOND_MOCK_TYPE = createElementType("SECOND_MOCK_TYPE", createElementEntity("SECOND_MOCK_TYPE"));

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

	this.createElement = function(location, type){
		this.recorders.createElement.invokedWith([location,type]);
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

	this.monadic = function(returnValue){
		let build = this.recorders.build;
		return function(first){
			build.invokedWith([first]);
			return returnValue;
		}
	}

	this.dyadic =  function(returnValue){
		let build = this.recorders.build;
    return function(first, second){
      build.invokedWith([first, second]);
      return returnValue;
    }
  }
}


function MockSnake(returnValue){
	this.recorders = {
		push : new Recorder("push"),
		head : new Recorder("head")
	};
	this.returnValue = returnValue;

	this.push = function(direction){
		this.recorders.push.invokedWith([direction]);
		return returnValue;
	};

	this.head = function(){
		this.recorders.head.invoked();
		return returnValue;
	};
}


function MockEngine(){
	this.recorders = {
		start : new Recorder("start"),
		tick : new Recorder("tick"),
		steer : new Recorder("tick"),
		shutDown : new Recorder("shut down")
	};

	this.start = function(){
		this.recorders.start.invoked();
	};

	this.tick = function(direction){
		this.recorders.tick.invokedWith([direction]);
	};

	this.steer = function(direction){
		this.recorders.steer.invokedWith([direction]);
	};

	this.shutDown = function(){
		this.recorders.shutDown.invoked();
	};
}


function MockTimer(){
	this.recorders = {
		start : new Recorder("startTimer"),
		stop : new Recorder("stopTimer")
	};

	this.start = function(callBack){
		this.recorders.start.invokedWith([callBack]);
	};

	this.stop = function(){
		this.recorders.stop.invoked();
	};
}


function MockGame(){
	this.recorders = {
		start : new Recorder("startGame"),
		stop : new Recorder("stopGame"),
		steer : new Recorder("steer")
	};

	this.start = function(){
		this.recorders.start.invoked();
	}

	this.stop = function(){
		this.recorders.stop.invoked();
	}

	this.steer = function(direction){
		this.recorders.steer.invokedWith([direction]);
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

	this.invokedWith = function(argumentList){
		console.log( this.name + " invoked with " + argumentList.length + " argument(s)." )
		let thisInvocation = new Invocation(argumentList);
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

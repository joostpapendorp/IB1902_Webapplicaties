"use strict";


function iterateReturnValuesOver(values){
	let index = 0;

	return () => {
		return values[index++];
	};
}


function MockFactory(name){
	this.recorders = {
		build : new Recorder(`build${name}`)
	};

	this.niladic = function(returnValue){
		let build = this.recorders.build;
		return function(){
			build.invoked();
			return returnValue;
		}
	};

	this.monadic = function(returnValue){
		let build = this.recorders.build;
		return function(first){
			build.invokedWith([first]);
			return returnValue;
		}
	};

	this.dyadic =  function(returnValue){
		let build = this.recorders.build;
    return function(first, second){
      build.invokedWith([first, second]);
      return returnValue;
    }
  };

	this.triadic = function(returnValue){
		let build = this.recorders.build;
    return function(first, second, third){
      build.invokedWith([first, second, third]);
      return returnValue;
    }
  };

  this.recordingFrom = function(buildFunction) {
		return buildFunction(this.recorders.build);
  };
}


function MockCanvas() {
	this.recorders = {
		drawArc : new Recorder("drawArc"),
		drawText : new Recorder("drawText"),
		clear: new Recorder("clear"),
		width: new Recorder("width"),
		height: new Recorder("height")
	};

	this.drawArc = function(radius, x, y, color){
		this.recorders.drawArc.invokedWith([radius, x, y, color]);
	};

	this.drawText = function(text, x, y){
		this.recorders.drawText.invokedWith([text, x, y]);
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
		console.log( this.name + " invoked with " + argumentList.length + " argument(s): " + argumentList.join() )
		let thisInvocation = new Invocation(argumentList);
		this.invocations.push(thisInvocation);
	};
}

function Invocation(argumentList){
	this.arguments = argumentList;
}

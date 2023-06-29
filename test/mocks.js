"use strict";

const FIXTURE_ELEMENT_ID = "fixture-element";

const MOCK_TYPE = createElementType("MOCK_COLOR", createElementEntity("MOCK_TYPE"));
const SECOND_MOCK_TYPE = createElementType("SECOND_MOCK_TYPE", createElementEntity("SECOND_MOCK_TYPE"));

const MOCK_LOCATION = createLocation(1, 2);
const SECOND_MOCK_LOCATION = createLocation(2, 1);


function iterateReturnValuesOver(values){
	let index = 0;

	return () => {
		return values[index++];
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


function MockHTMLCanvas() {
	this.recorders = {
		drawArc : new Recorder("drawArc"),
		drawText : new Recorder("drawText"),
		prop : new Recorder("prop")
	};

	this.drawArc = function(props){
		this.recorders.drawArc.invokedWith([props]);
	};

	this.drawText = function(props){
		this.recorders.drawText.invokedWith([props]);
	};

	this.prop = function(arg){
		this.recorders.prop.invokedWith([arg]);
	};
}


function MockMath(mockRandomValues, mockFloorValues) {
	this.recorders = {
		random : new Recorder("random"),
		floor : new Recorder("drawText")
	};

	this.mockRandomValues = mockRandomValues;

	this.mockFloorValues = mockFloorValues;

	this.random = function(){
		this.recorders.random.invoked();
		return this.mockRandomValues();
	};

	this.floor = function(number){
		this.recorders.floor.invokedWith([number]);
		return this.mockFloorValues(number);
	};
}

function MockBoard(){
	this.recorders = {
		createElement : new Recorder("createElement"),
		replace : new Recorder("replace"),
		remove : new Recorder("remove"),
		clear : new Recorder("clear"),
		redraw : new Recorder("redraw"),
		elementAt : new Recorder("elementAt"),
		writeAt : new Recorder("writeAt")
	};

	this.createElement = function(location, type){
		this.recorders.createElement.invokedWith([location,type]);
	};

	this.replace = function(element){
		this.recorders.replace.invokedWith([element]);
	};

	this.remove = function(element){
		this.recorders.remove.invokedWith([element]);
	};

	this.clear = function(){
		this.recorders.clear.invoked();
	};

	this.redraw = function(){
		this.recorders.redraw.invoked();
	};

	this.elementAtReturns = function(location) {
		return { type : FREE_SPACE_TYPE };
	};

	this.elementAt = function(location){
		this.recorders.elementAt.invokedWith([location]);
		return this.elementAtReturns(location);
	};

	this.writeAt = function(location, text){
		this.recorders.writeAt.invokedWith([location, text]);
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


function MockFood(){
	this.recorders = {
		plant : new Recorder("plantFood"),
	};

	this.plant = function(){
		this.recorders.plant.invoked();
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


function MockRuleSet(stateToReturn, tallyText){
	this.recorders = {
		prepare : new Recorder("prepare"),
		initialDirection : new Recorder("initialDirection"),
		createStartSnake : new Recorder("createStartSnake"),
		start : new Recorder("start"),
		update : new Recorder("update"),
		gameWon : new Recorder("gameWon"),
		gameLost : new Recorder("gameLost"),
	};

	this.stateToReturn = stateToReturn;

	this.prepare = function(){
		this.recorders.prepare.invoked();
		return stateToReturn;
	}

	this.initialDirection = function(){
		this.recorders.initialDirection.invoked();
		return stateToReturn;
	}

	this.createStartSnake = function(board){
		this.recorders.createStartSnake.invokedWith([board]);
		return new MockSnake();
	}

	this.start = function(){
		this.recorders.start.invoked();
		return stateToReturn;
	}

	this.update = function(result){
		this.recorders.update.invokedWith([result]);
		return stateToReturn;
	}

	this.gameWon = function(){
		this.recorders.gameWon.invoked();
		return tallyText;
	}

	this.gameLost = function(){
		this.recorders.gameLost.invoked();
		return tallyText;
	}
}


function MockSplashScreen(){
	this.recorders = {
		writeGameWon : new Recorder("writeGameWon"),
		writeGameOver : new Recorder("writeGameOver")
	};

	this.writeGameWon = function(board){
		this.recorders.writeGameWon.invokedWith([board]);
	};

	this.writeGameOver = function(board){
		this.recorders.writeGameOver.invokedWith([board]);
	};
}


function MockIndexedDBConnection(request){
	this.recorders = {
		open : new Recorder("open")
	};

	this.open = function(handle, version){
		this.recorders.open.invokedWith([handle, version]);
		return request || new MockRequest();
	};
}


function MockRequest(){
	this.recorders = {
		onUpgradeNeeded : new Recorder("onUpgradeNeeded")
	};

	//nocapitalizationconventionhere !!
	this.onupgradeneeded = function(callBack){
		this.recorders.onUpgradeNeeded.invokedWith([callBack]);
	};

	//nocapitalizationconventionhere !!
	this.onsuccess = function(callBack){
		this.recorders.onSuccess.invokedWith([callBack]);
	};

	//nocapitalizationconventionhere !!
	this.onerror = function(callBack){
		this.recorders.onSuccess.invokedWith([callBack]);
	};
}


function MockIndexedDB(objectStore){
	this.recorders = {
		createObjectStore : new Recorder("createObjectStore")
	};

	this.createObjectStore = function(name, options){
		this.recorders.createObjectStore.invokedWith([name, options]);
		return objectStore || new MockObjectStore();
	};
}


function MockSnakeStorage(){
	this.recorders = {
		requestStorage : new Recorder("requestStorage"),
	};

	this.requestStorage = function(handle){
		this.recorders.requestStorage.invokedWith([handle]);
	};
}


function MockObjectStore(counts){
	this.countResults = counts || (() => 0);

	this.recorders = {
		createIndex : new Recorder("createIndex"),

		get : new Recorder("get"),
		count : new Recorder("count"),
		add : new Recorder("add"),
	};

	this.createIndex = function(name, column, props){
		this.recorders.createIndex.invokedWith([name, column, props]);
	};

	this.get = function(key){
		this.recorders.get.invokedWith([key]);
	};

	this.count = async function(key){
		this.recorders.count.invokedWith([key]);
		return Promise.resolve(this.countResults());
	};

	this.add = function(value){
		this.recorders.add.invokedWith([value]);
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

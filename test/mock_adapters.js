"use strict";


/**** HTML *****/

export const MOCK_CANVAS_ID = "MOCK_CANVAS_ID";
const FIXTURE_ELEMENT_ID = "fixture-element";

export function MockHTMLCanvas() {
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

// loan pattern to isolate html-fixture setup and tear down
export function withHTMLCanvasUsing(props, testFunction){
		let mockCanvas  = $(document.createElement("canvas")).
			prop("id", props.id || MOCK_CANVAS_ID).
			prop("width", props.width || 0).
			prop("height", props.height || 0);

		$("#"+FIXTURE_ELEMENT_ID).append(mockCanvas);

		testFunction(mockCanvas);

		mockCanvas.remove();
}


/**** SYSTEM *****/

export function MockMath(mockRandomValues, mockFloorValues) {
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


/**** DATABASE *****/

export function MockIndexedDBConnection(request){
	this.recorders = {
		open : new Recorder("open")
	};

	this.open = function(handle, version){
		this.recorders.open.invokedWith([handle, version]);
		return request || new MockRequest();
	};
}

export function MockRequest(){
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

export function MockIndexedDB(objectStore){
	this.recorders = {
		createObjectStore : new Recorder("createObjectStore")
	};

	this.createObjectStore = function(name, options){
		this.recorders.createObjectStore.invokedWith([name, options]);
		return objectStore || new MockObjectStore();
	};
}

export function MockSnakeStorage(){
	this.recorders = {
		requestStorage : new Recorder("requestStorage"),
	};

	this.requestStorage = function(handle){
		this.recorders.requestStorage.invokedWith([handle]);
	};
}

export function MockObjectStore(counts){
	this.recorders = {
		createIndex : new Recorder("createIndex")
	};

	this.createIndex = function(name, column, props){
		this.recorders.createIndex.invokedWith([name, column, props]);
	};
}

"use strict";


export function createState(description){
	let state = new State(description);
	Object.freeze(state);
	return state;
}

function State(description){
	this.description = description;
}

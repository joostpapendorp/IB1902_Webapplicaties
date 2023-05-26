"use strict";

const UP = createLocation(0,-1);
const DOWN = createLocation(0,1);
const LEFT = createLocation(-1,0);
const RIGHT = createLocation(1,0);

function createLocation(xCoordinate,yCoordinate){
	function Location(x,y){
		this.x = x;
		this.y = y;
	}

	let location = new Location(xCoordinate,yCoordinate);
	Object.freeze(location);

	return location;
}

"use strict";

const UP = createLocation(0,-1);
const DOWN = createLocation(0,1);
const LEFT = createLocation(-1,0);
const RIGHT = createLocation(1,0);

const NO_LOCATION = createLocation(0,0);

function createLocation(xCoordinate,yCoordinate){
	function Location(x,y){
		this.x = x;
		this.y = y;

		this.translated = function(that){
			return new Location(
				this.x + that.x,
				this.y + that.y
			);
		}

		this.describe = function(){
			return `(${x},${y})`;
		}
	}

	let location = new Location(xCoordinate,yCoordinate);
	Object.freeze(location);

	return location;
}

"use strict";

export function createLocation(xCoordinate,yCoordinate){
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

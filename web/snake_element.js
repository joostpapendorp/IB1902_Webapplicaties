function createElementFactory(){

	function Element(location, color) {
		this.location = location;
		this.color = color;

		this.withColor = function(updatedColor){
			return new Element(this.location, updatedColor);
		};
	}

	function createElement(location, color){
    let element = new Element(location,color);
    Object.freeze(element);
    return element;
  }

	return {
		createElement : function(location, color){
		 return createElement(location, color);
	 }
	};
}

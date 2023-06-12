"use strict";

function createElementFactory(){

	function Element(location, type) {
		this.location = location;
		this.type = type;

		this.withType = function(updatedType){
			return new Element(this.location, updatedType);
		};

		this.entity = function(){
			return type.entity;
		};
	}

	function createElement(location, type){
    let element = new Element(location,type);
    Object.freeze(element);
    return element;
  }

	return {
		createElement : function(location, type){
			return createElement(location, type);
		}
	};
}

function createElementType(color, entity){
	function Type(color, entity){
		this.color = color;
		this.entity = entity;
	}

	let type = new Type(color, entity);
	Object.freeze(type);
	return type;
}

function createElementEntity(description){
	function ElementEntity(description){
		this.description = description;
	}

	let entity = new ElementEntity(description);
	Object.freeze(entity);
	return entity;
}

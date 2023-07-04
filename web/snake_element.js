"use strict";

/**
	@function createElementFactory() -> interface onto element creation
	@desc creates a factory which creates elements
	@return: {anonymous object} An interface onto the element factory
*/
export function createElementFactory(){

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
		/**
			@function createElement(location, type) -> Element
			@desc creates an immutable element with the given values
			@param {Location} location The location to locate the element at
			@param {Type} type A crocodile. Either that, or the type of the element
			@return: {Element} An immutable element
		*/
		createElement : function(location, type){
			return createElement(location, type);
		}
	};
}

/**
	@function createElementType(color, entity) -> ElementType
	@desc defines a new type of element
	@param {string} color The HTML-description of the color of the element
	@param {ElementEntity} entity The grouping entity to which this type belongs
	@return: {ElementType} An immutable ElementType
*/
export function createElementType(color, entity){
	function Type(color, entity){
		this.color = color;
		this.entity = entity;
	}

	let type = new Type(color, entity);
	Object.freeze(type);
	return type;
}

/**
	@function createElementEntity(description) -> ElementEntity
	@desc defines a new element entity to group element types with. Note that this documentation exceeds the word count of the actual code.
	@param {string} description A descriptive text. Like this one, but actually informative.
	@return: {ElementEntity} an immutable entity
*/
export function createElementEntity(description){
	function ElementEntity(description){
		this.description = description;
	}

	let entity = new ElementEntity(description);
	Object.freeze(entity);
	return entity;
}

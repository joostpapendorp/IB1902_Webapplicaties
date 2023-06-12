"use strict";

const INITIAL_DIRECTION = UP;
const NUMBER_OF_FOODS_PER_BASIC_GAME = 5;


function ruleSets(foodPlanter) {

	function BasicRuleSet(foodPlanter){
		this.foodPlanter = foodPlanter;

		this.initialDirection = function(){
			return INITIAL_DIRECTION;
		};

		this.prepare = function(){
			for(let i = 0; i < NUMBER_OF_FOODS_PER_BASIC_GAME; i++ )
				foodPlanter.plant();
		};
	}

	// poor mans polymorphism:
	function basic() {
		return buildRuleSet(BasicRuleSet);
	}

	function buildRuleSet(constructor) {
		let ruleSet = new constructor(foodPlanter);

		return {
			initialDirection : () => ruleSet.initialDirection(),
			prepare : () => ruleSet.prepare()
		}
	}

	return {
		basic : () => basic(),
	}
}

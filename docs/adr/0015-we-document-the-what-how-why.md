# 15. We document the what-how-why

Date: 2023-07-01

## Context

The assignment requires us to documenet our code. The course textbook advocates JSDoc as a documentation tool. We are committed to [documenting our decisions using ADR](./0002-keep-architectural-decision-records.md). We write clear and concise tests. We write clean code. 

## Decision

To provide insight into our code and our app, we make sure to document on three different levels: 
* _What_ the code is supposed to do,
* _How_ it achieves this goal, and
* _Why_ it does it in the way that it does.

We adhere to the practice of _clean coding_ [Mart08] and avoid unnecessary and polluting comment in our code (see below).

### What

The requirements of the code should be apparent from the function names we use in our code and the descriptions of the tests. Tests are living documentation, which fail to execute when they are out-of-date, unlike regular (JSDoc) comments.

In short, if one is interested in what a piece of code is supposed to do, one should look at the accompanying test suite. As a simple example of a documenting test, consider the following (from [player_suite.js](../../test/player_suite.js):

    QUnit.test("Player converts unknown codes into sentinel value",
    assert => {
    assert.expect(1);
    
            const UNKNOWN_CODE = -1;
    
            let subject = createPlayer();
    
            let actualDirection = subject.receive(UNKNOWN_CODE);
            assert.equal(actualDirection, NO_LOCATION, "player converts unknown codes to NO_LOCATION" );
        }
    );


### How

How a requirement is implemented should be inherently clear from the way we write our code. The functions should be self-explanatory and short enough to view and comprehend in a single overview. Names should be self-explanatory. For example (from [snake_snake.js](../../web/snake_snake.js)):


			this.move = function(direction){
				this.removeLastTailSegment();
				this.repaintOldHeadAsBody();
				this.addNewHeadIn(direction);
				return SNAKE_MOVED;
			};



### Why

We use our ADR setup to document any left-over concerns that aren't apparent from the design separately, such as architectural overviews or historical choices. 


## Alternatives

### Comments

The example code of the assignment is riddled with comments. For example:

      NUMFOODS = 15,          // aantal voedselelementen       
    
Compare this to our method (from [snake_rule_set.js](../../web/snake_rule_set.js)):

    export const NUMBER_OF_FOODS_PER_BASIC_GAME = 5;

The need for the comment evaporates with expressive names. Furthermore, comments are prone to going out-of-date when code changes. Therefore, we will avoid comments in lieu of expressive code.


### JSDoc

The assignment requires us to use JSDoc to document our functions. The given starting code gives the following example:
    
    /**
        @function move(direction) -> void
        @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen  
        @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
    */
    function move(direction) {

Now let's ask ourselves: who is this information for? In general, it is good practice to document endpoints that other parties have to consume. However, this app has no endpoints. All its functions are for internal use. This means that all the documentation is for _its own developers_, who could just as easily look at the code and the tests.

Secondly, let's ask ourselves: What information does this documentation _actually_ provide? Firstly, it mainly states its function's signature and the types of the arguments. In Java, this would be evident from the declaration alone:
    
    void move( String direction )

So we're just fighting against the language again. Secondly, it tells us that we can only input certain values. This is a design constraint, which can be solved using well-chosen types. Consider our alternative:


			this.push = function(direction){
				let newLocation = this.head().location.translated(direction);
				let elementPresent = board.elementAt(newLocation);

				switch(elementPresent.entity()){
					case OFF_THE_BOARD_ENTITY:
					case SNAKE_ENTITY:
						return this.die();

					case FOOD_ENTITY:
						return this.eat(elementPresent);

					case FREE_SPACE_ENTITY:
						return this.move(direction);
				}
			};

All the information is already present, in a single glance. No need for comments, and with further information available in the tests.     

In short, JSDoc comments are bland, tedious, polluting and, when they inevitably go out of sync, actively harmful.

However, we do wish to demonstrate our proficiency with the tool. Therefore, we will, in addition to the method outlined above, document (only) the exported functions of every module with JSDoc. 


### References

[Mart08]: Robert C, Martin, "Clean code: A Handbook of Agile Software Craftmanship", 2008 

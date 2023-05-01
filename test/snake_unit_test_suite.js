QUnit.module( "Test suite for the Snake game" );

QUnit.test( "Constant definitions",
    function( assert )
    {
	    assert.expect(1);
     	assert.equal( STEP, 20, "size of a step is the diameter of one element" );
		}
);

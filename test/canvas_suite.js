QUnit.module("Canvas");

QUnit.test("Canvas size is taken from .html",
	assert => {
		assert.expect(2);

		let expectedWidth = 1;
		let expectedHeight = 2;

		withHTMLCanvasUsing( { width : expectedWidth, height : expectedHeight },
			canvas => {
				// call document-ready function
				loadCanvasFromHTML();

				assert.equal(snakeCanvas.width(), expectedWidth, "with should come from .html");
				assert.equal(snakeCanvas.height(), expectedHeight, "height should come from .html");
			}
		);
	}
);

// loan pattern to isolate html-fixture setup and tear down
function withHTMLCanvasUsing(props, testFunction){
		let mockCanvas  = $(document.createElement("canvas")).
			prop("id", props.id || SNAKE_CANVAS_ID).
			prop("width", props.width || 0).
			prop("height", props.height || 0);

		$("#"+FIXTURE_ELEMENT_ID).append(mockCanvas);

		testFunction(mockCanvas);

		mockCanvas.remove();
}

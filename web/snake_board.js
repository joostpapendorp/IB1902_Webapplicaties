const BOARD_SIZE = 18;

function createBoard(canvas){
	board = new Board();

	function Board(){
		let smallestCanvasDimension = Math.min( canvas.width(), canvas.height() );

		this.tileSize = Math.floor( smallestCanvasDimension / BOARD_SIZE );
		this.elementRadius = Math.floor(this.tileSize / 2);

		this.toPixels = function(coordinate){
			return coordinate * this.tileSize + this.elementRadius;
		}

		this.drawElement = function(x,y,color){
			canvas.drawArc(
				this.elementRadius,
				this.toPixels(x),
				this.toPixels(y),
				color
			);
		}

		this.clear = function(){
			canvas.clear();
		}
	}

	function Element(x, y, color) {
		this.x = x,
		this.y = y,
		this.color = color

		this.draw = function(){
			board.drawElement(this.x, this.y, this.color);
		}
	}

	return {
		createElement : function(x, y, color){
			let element = new Element(x,y,color);

			return {
				draw : () => element.draw()
			};
		},

		clear : () => board.clear()
	};
}

/**
  @function createSegment(x,y) -> Element
  @desc Slangsegment creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaat middelpunt
  @param {color} kleur v/h element
  @return: {Element} met straal ELEMENT_RADIUS
*/
function createElement(x, y, color) {
	/**
	   @constructor Element
	   @param radius straal
	   @param {number} x x-coordinaat middelpunt
	   @param {number} y y-coordinaat middelpunt
	   @param {string} color kleur van het element
	*/
	function Element(radius, x, y, color) {
			this.radius = radius,
			this.x = x,
			this.y = y,
			this.color = color

			this.draw = function(){
				snakeCanvas.drawArc(
					this.radius,
					this.x,
					this.y,
					this.color
				);
			}
	}
	let element = new Element(ELEMENT_RADIUS, x, y, color);

	return {
		draw: function(){
			element.draw();
		}
	};
}

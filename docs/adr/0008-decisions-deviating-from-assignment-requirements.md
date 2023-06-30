# 8. Decisions deviating from assignment requirements

Date: 2023-05-25

## Decision

This is a list of major and minor choices in which we deviated from the assignment or the textbook, and the motivations for those choices. All of these choices we made explicitly and willfully. Currently, there are two main reasons for deviating:

 * Obsolescence. Some practices or tools the book advocates are out of date. We use an updated version.
 * Architectural. When a programming style or technique has a clear architectural downside _and_ an unequivocal superior alternative, we use that alternative instead.

We are aware these choices might be controversial, hence our attempt to explain them and our motivations behind them. We didn't make these choices lightly. None of these choices are made because of our personal preferences (e.g. coding style, base techniques). In short, in these instances we preferred the spirit of the law over the letter of the law. 


## Overview of deviations

1. We won't use JSLint. Instead, we use ESLint. 
2. We won't be following the template in calculating the positions of elements on the board. In stead, we separate board and canvas into two different concerns.


## 1. We won't use JSLint

See [ARD 007](0007-code-is-neatly-styled..md) for this discussion.


## 2. We separate board and canvas.

The canvas offers constant declarations for the radius and diameter of the elements. Also, it asked to retrieve dimensions from the canvas HTML element. This left the board size, i.e. the number of elements that fit on the board in any dimension, implicit.
This raises interesting questions, like
* what if the canvas size changes in the HTML, does that mean the game board becomes larger and thus the game becomes easier?
* what if the game is played on other monitor sizes, how would we (theoretically) scale the experience?

We concluded that the _game board_ and the _representation_ are two different concerns, and we introduced a separate _board_ entity. Since the values retrieved from the canvas are non-constant, we can't and shouldn't maintain fixed sizes for the game pieces. The constants given in the template are no longer sufficient, and we deleted them. We chose to calculate the size of the pieces from a fixed board size instead.

## 3. We won't implement an MVC design.

See [ADR 14](./0014-we-modularize-our-code.md) for this discussion.

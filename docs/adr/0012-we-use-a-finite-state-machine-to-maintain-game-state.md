# 12. We use a finite-state machine to maintain game state

Date: 2023-06-13

## Decision

To maintain a sane overview of the state of the game, we use the 
[finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) shown below. Note that the _Game Won_ state is only relevant for the basic rule set.


### States of the app
Independent of this, the app itself also maintains a state: Either _Started_ (and idle), _Running_ or _Stopped_.
_Started_ and _Stopped_ correspond to the two .html buttons.
The app is _Running_ is when an actual game has started.
Starting an already running app results in stopping the game and returning to the idle state.
Note that the diagram does not yet show the idle state (calling the _Running_ state _Started_), since this was added after the drawing was made. 

![finite-state machine of the game and app](./fsm.jpeg)

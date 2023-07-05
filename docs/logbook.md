# We will keep a development log book


### 2022-12-08

Afgesproken om Trello en Git te gebruiken. Rinaldo maakt bord en Joost maakt repo aan.
Afgesproken om Rinaldo's uitwerking te gebruiken als basis voor de site.
Zie mails dd. 7-12 (thread dd. 22-11)


### 2022-12-15

PR #1 voor repo.
Bord staat.


### 2023-01-17

Rinaldo heeft aangegeven niet verder te willen. Joost heeft Sylvia gemaild. Joost gaat alleen verder.
Zie mails dd. 17-01.


### 2023-01-24

ADR tooling geïnstalleerd.
Log book aangemaakt.
Readme links aangepast.


### 2023-02-10

Contact gehad met Sylvia (mail) over herstart van project na het overlijden van mijn moeder.
Zie mail.
Bij inleveren mail sturen naar:

    Allaeddin Swidan, 
    Allaeddin.Swidan@ou.nl. 


### 2023-02-17

Opnieuw opgestart na crematie.

ADRs toegevoegd: trello, adr, logbook, DoD, Git en Git flow.

Definition of done draft gemaakt.


### 2023-03-04

[v] fix de login van GitHub (again).

Structuur van de repo is iets vervuild, door het herhaaldelijk proberen om de remote en de local repo's te hersynchroniseren.


### 2023-05-01

[v] login op Trello (again)

https://trello.com/b/djHvyLDG/ib1902-webapplicaties-opdracht-2

gebruikt joost.papendorp

[v] merge 004

005 QUnit

https://qunitjs.com/

updated npm to 9.6.5


### 2023-05-8

006 - Something on the screen

[ v ] copy code to clean file when needed, clearing the template slowly.

#### ??? Waar komt jcanvas vandaan?
Index.html heeft geen js nodig, stond fout in templates. Ik denk dat het deze is (???)

https://projects.calebevans.me/jcanvas/docs/

In de min versie via cloudfare komt Caleb Evans ook terug als auteur; inmiddels raadt de site van hem zelf aan om de min via GitHub te downloaden: https://projects.calebevans.me/jcanvas/downloads/

Laatste versie is gelijk: 21.0.1. Support the author, dus via de site zelf.

templates are incomplete? (no stop)

(Pomodoro 1)

    As a side note, you cannot accurately set a canvas’s width and height via CSS; you can only do so through the canvas element’s width and height attributes.

    The resource from “https://raw.githubusercontent.com/caleb531/jcanvas/v21.0.1/dist/min/jcanvas.min.js” was blocked due to MIME type (“text/plain”) mismatch (X-Content-Type-Options: nosniff).

    How to Perform a Hard Refresh in Your Browser: Chrome, Firefox, or Edge for Windows: Press Ctrl+F5 (If that doesn’t work, try Shift+F5 or Ctrl+Shift+R).

(Pomodoro 2)

Ik weet niet hoe ik dit oplos, het kost tijd en is niet essentieel: Revert JCanvas to cloudfare source; dit werkt wel.

(Pomodoro 3)

[ v ] import js module of via html?
LEH 7 pp 163

(Pomodoro 4)

$("#mySnakeCanvas").clearCanvas() violates Demeter; no chaining in assignments.

(Pomodoro 5)

$("#mySnakeCanvas") geeft leeg jquery object na verplaatsing naar module object in snake_canvas.js --> onDocumentReady? lazy?

(Pomodoro 6)

linting is out of scope for this story, split it off into its own.

(Pomodoro 7)

Mocking manually for now. deepEqual werkt niet als constructor gebruikt is; propEqual doet wel duck typing. Pag 151.

(Pomodoro 8)


### 2023-05-09

[ V ] styling choices --> ADR

(Pomodoro 1)

    1:5  error  'snakeCanvas' is assigned a value but never used  no-unused-vars

e.v. Blijkbaar kan de linter niet in de .html kijken. Pleit voor modules. Rest is logisch als gevolg van w.i.p.


### 2023-05-22

(Pomodoro 1 +2 + 3)

Story *8 - Make a snake*

[ v ] multiple invocations of same mock overrides values

Create a recorder that lists invocations

(Pomodoro 4)

_array.forEach( function )_ apparently creates a closure over the given function only, _even while_ it is part of an object. Thus, _this_ referenced from within this function is no longer its object, but _Window_. Goody.

(Pomodoro 5 + 6)


#### center of the screen.

Calculations given by example result in 170, but 360/2 = 180.

?? What constitutes the coordinates given to _drawArc_? Is that the upper left corner of the box around the arc, or the center of the arc?

Docs don't specify https://projects.calebevans.me/jcanvas/docs/arcs/

==> draw a circle at Origin to find out: drawArc uses (x,y) as the center of the circle.  The canvas consists of a grid of

    (width, height) ==> lower right corner of canvas
    (width / ELEMENT_DIAMETER, height/ELEMENT_DIAMETER) ==> width/height in number of boxes on the canvas

with (360,360) canvas size, this amounts to a grid of 360/20 = 18x18 spaces, indexed [0..17]. So there _is no_ central box. Putting the snake in the closest central positions, facing east, would be at

    body (8, 8) and
    head (9, 8).

Coordinate 8 amounts to (8 * DIAMETER + RADIUS) = (8 * 20 + 10) = 17 * 10 = 170. And 9 analogue to 190. So, final central coordinates are:

    BODY = (8,8) = (170, 170)
    HEAD = (9,8) = (190, 170)


### 2023-05-24

story _009-Define_playing_field_

Formalize the above: split the canvas size and the board grid into separate entities

Append/remove dom elements via Javascript: pp. 213

(Pomodoro 1+2)

Introduce loan pattern to isolate tests (story _010-Mocking_and_modularize_testing_).

(Pomodoro 3+4+5)

Create a board and inject the canvas.

? Moet een element een referentie hebben naar het board, of moet het tekenen van het element het board meekrijgen?
===> Een element wordt altijd gecreerd op het board, dus laat het board de elementen maken.

    "No elements possible without a board, yet an empty board has no elements."

Maakt dat element een internal van board? ===> ja, wel zelfde package, exports alleen de gecreeerde elements.

Dit lost ook de plaatsing van de constanten E_R, E_D en H_G_S/ V_G_S op.

(Pomodoro 6 + 7)

(Pomodoro 8 + 9)

[v] move ondocready to main
[v] redirect from element to board
[v] remove old constants

wederom een closure dat *_niet_* de omgeving meeneemt??? ===> nee. Referencing a function van een object neemt zijn context niet over, waardoor die waarden NaN zijn. In plaats daarvan juist wel een closure over de aanroep gebruiken. Geen foutmelding, echter, want javascript

[v] harden tests with new situation


### 2023-05-25

stories _009-Define_playing_field_ and _010-Mocking_and_modularize_testing_

(Pomodoro 1 + 2)

story _011-move_a_snake_

? reuse elements while moving? of drop elements? gc?

javascript heeft gc: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management

Zijn de references unreachable als ik ze uit de snake array tief? ==> _let_ is local, maar closure!

?? Worden alleen de _in de closure gebruikte_ variabelen in de closure gestopt? of is de closure over de hele scope??

    Bewegen
    Figuur 1.3 maakt duidelijk hoe we de slang eenvoudig DOWN
    kunnen laten bewegen. Er wordt een extra segment toegevoegd aan het
    einde, en het eerste segment verdwijnt. Bovendien krijgt het nieuwe
    segment de kleur van de kop, terwijl de originele kop verandert in een
    ‘gewoon’ segment.

dus wel gewoon nieuwe segmenten maken.

    De richting waarin de slang beweegt bij de start van het spel is omhoog.

oepsie. aanpassen.

(Pomodoro 3)


### 2023-05-26

story _011-move_a_snake_

location should be explicit

(Pomodoro 1+2)

HT vs Map: https://www.freecodecamp.org/news/javascript-hash-table-associative-array-hashing-in-js/


### 2023-05-27

Use factory pattern for snake.

(Pomodoro 1+2)


WTF? function reference werkt _toch wel_ met een closure over het board argument??

    return{
        createSnake : createSnake
    };

(Pomodoro 3)

Om te testen of snake de elementen manipuleert, moet het board mocks terug gaan geven van de elementen. Deep mocking is
frowned upon:

    "when a mock returns a mock, a fairy dies."

Maar element is onderdeel van het board. Dit board is effectief de element factory, dus splitsing heeft weinig zin.
Toch zijn board en element conceptueel verschillende dingen.

Ze zijn verbonden vanwege de integriteit van het board: de manipulaties van element verlopen via het board, omdat deze de
referenties beheert. Moving an element is replacing an element b/c of immutability.

==> on that note: is board niet gewoon ook de factory voor snake?? ==> Nee. Board interactions worden afgetest.
==> kunnen we dan niet hetzelfde truukje uithalen voor element? e.g:

    createElementFactory(board).createElement(location, color)

Vergelijk het gebruik van de snake in game:

    function createStartSnake(snakeFactory)
    ...
	    return snakeFactory.createSnake(locations);

dit is gemocked als:

    createStartSnake(mockSnakeFactory);

in essentie is de createElementFactory gelijk aan createBoard. Het probleem gaat daar ook ontstaan als we aankomen bij
het aftesten van snake.move. de snake is dan de mock teruggegeven door snakeFactory. mocks door mocks. dead fairy.

https://softwareengineering.stackexchange.com/questions/406146/how-to-avoid-mock-returning-mock-when-using-factory-pattern

==> split from story, double-mock for now.


### 2023-06-05

(P 1,2)

Normaal zou de test local access hebben in Snake, zodat het de factory omzeilt. Uiteraard kan ook dat niet in Javascript.


(P 3, 4, 5)

[v] partially mock board?

(P 6, 7)

[v] updating the snake array
[v] implementing new board functions

(P 8)
[v] move manually in game

(P 9)


### 2023-06-06

(P 1)

[v] isolate game as a concept.

(P 2, 3)


### 2023-06-08

(P 1, 2, 3)
[v] add the engine

==> ik = dropje: factory pattern is redundant in 'functionele' taal: simply pass functions in.
Maar hoe kunnen we dit dan recorden?

[v] replace factory patterns with functions.

(P 4)
[v] add timer
[v] clear board contents

(P 5, 6, 7)
[v] prettify & test timer, move timeout naar timer

(P 8)
[v] Factory pattern ADR
[v] DoD

(P 9)

story _012-steer_a_snake_

Dropping immutability for game b/c of Direction; this is a non-functional design.

(P 10, 11)

story _013-kill_a_snake_


### 2023-06-09

(P 1)

Feature envy:

    let newLocation = snake.head().location.translated(direction);

maar snake zit al zo vol

(P 2)

??? Engine als aparte entiteit? of re-integreren in Game?
==> engine is apart v/w de snake vs. snakeFactory.

??? move spul van game naar engine?
==> timer, direction

(P 3, 4, 5)
[v] move timer, direction van Game naar Engine

(P 6)
[v] harden tests
[v] Stop timer on kill

(P 7, 8)
[v] Dead snake turns black

    map.set(createLocation(0,0), "a");
    map.get(createLocation(0,0))
    => undefined.

want tuurlijk. @#%$^@

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality

ging tot dusver toevallig goed omdat we onbewust dezelfde objecten herbruikten.

[v] convert board into double array. goodbye efficiency
[v] Snake dies on own body


### 2023-06-10

(P 1, 2)

story _014-feed_a_snake_

[v] enrich element with type

??? what 'element' is an out-of-bounds element?
??? wrapper around element? 'square'? ==> Square(Element(Location(Int,Int),String),Type())

==> No. use type as wrapper for color. Define types as constants in the appropriate places. This is simply a more elegant
way than to switch directly on the colors.

    const SNAKE_HEAD_COLOR = "DarkOrange";
    const SNAKE_BODY_COLOR = "DarkRed";
    
    const DEAD_SNAKE_BODY_COLOR = "Black";
    const DEAD_SNAKE_HEAD_COLOR = "DarkGrey";

??? These are all snake types. Unify? diversify? Property 'class'?
==> introduce concept of 'entity'. Entity is the game concept the element is part of, e.g. snake, food, wall

(P 3)

[v] have board return empty element on empty space
[v] snake can now switch on element type

(P 4)

[v] Snake eats a food and grows

(P 5)

[v] copy example code
[v] design RNG adapter ==> functional style

(P 6, 7)

??? Wie genereert food?
==> Engine bepaalt wanneer. Game bepaalt hoe.

### 2013-06-11

(P 1)

Got the shit working untested, including the ending. Now we must integrate story _015- end the game_ into this one.
[v] paint the text (canvas)

(P 2)

    for (let x = 0; x < BOARD_SIZE; x++)
        for (let y = 0; y < BOARD_SIZE; y++){
            let next = this.elements[x][y];
            if(next)
                this.drawElement(next.location, next.type.color);
        }
    };

Inefficient!
??? Can we use flatmap to just iterate the set elements?
==> we already have the verification:

    assert.equal(drawArc.timesInvoked(), 2, "redraw draws both elements");

[v] use flatMap to iterate the board
[v] paint the text (board)

(P 3)

introduce rule set to manage foods and game endings

### 2023-06-12

(P 1, 2, 3)
[v] food planter plants at random locations

(P 4 ,5, 6)
[v] random generates random location

(P 7)
[v] basic rule set generates food on board
[v] engine uses rule set to initialize board
[v] Generate foods

(P 8)
[v] Ports and adapters ADR

(P 9)

Story _015-End_the_game_

(P 10, 11)
[v] Dead snake ends the game
[v] Eating all food ends the game
[v] Engine calls rule set for updates on state.


#### 2023-06-13

(P 1, 2, 3, 4, 5, 6)
[v] move start snake from game to rules
[v] Test states in Engine
[v] rule set builds basic snake

(P 7)
[v] report win and loss
[v] splash screen

(P 8)
[v] fix start-restart issue

(P 9, 10)
[v] Game State ADR


### 2023-06-14

(P 1)

Story _016-scoring_

!!! Beoordelingscriteria op youlearn zijn inconsistent! Op de pagina vóór de opdracht staan wél de goede criteria.
[v] pas criteria aan in DoD.

(P 2)


### 2023-06-15

(P 1)

??? Hoe weet ik of een DB al bestaat?
==> kan niet. dus niet testen. Gebruik mock om callbacks af te vangen.
[ ] define local storage facade.


### 2023-06-26

(P 1)
https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#storing_complex_data_%E2%80%94_indexeddb

(P 2, 3, 4, 5, 6, 7, 8, 9)


### 2023-06-27

(P 1, 2, 3, 4, 5)
[v] show wins / losses

(P 6)
[v] pass storage through game

(P 7)


### 2023-06-28

(P 1)
[v] transaction times out => extract facade which opens a transaction to the store each time.

    Uncaught DOMException: Data provided to an operation does not meet requirements.

(P 2, 3, 4)
[v] retrieve wins / losses

https://stackoverflow.com/questions/49128292/indexeddb-wait-for-event
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve

(P 5)
https://stackoverflow.com/questions/51119821/query-objects-on-index-idb?rq=3
[v] add indices to storage
[v] store wins / losses


### 2023-06-29

(P 1, 2, 3)
[v] ADR

(P 4, 5)
Story _017-Modularization_
[v] module diagram

(P 6, 7)
[v] introduce module Canvas,

test graduality ===> HAHAHAHAHA Nope.
--> eerst as-is, dan split

    Module source URI is not allowed in this document: “file:///E:/files/studie/OU/Webapplicaties/Opdrachten/Opdracht2/IB1902_Webapplicaties/test/canvas_suite.js”.

en

    Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///E:/files/studie/OU/Webapplicaties/Opdrachten/Opdracht2/IB1902_Webapplicaties/web/snake_canvas.js. (Reason: CORS request not http).

https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp?utm_source=devtools&utm_medium=firefox-cors-errors&utm_campaign=default

Textboek pp 187:

    In de eerste plaats kunnen we het HTML-bestand niet meer via het filesysteem bekijken. We hebben een lokale webserver nodig.

cursussite:

    Een simpele webserver

    De oplossing: een heel simpele HTTP-server.
    Installeer https://nodejs.org/en/
    Je hoeft daarbij niet aan te vinken dat er méér dan alleen nodejs geïnstalleerd wordt.
    
    Dan geef je, in een PowerShell (die hoort op het systeem te staan, en is anders te vinden in de Microsoft app) die je als adminustrator draait, het commando:
    
    npm install --global http-server
    
    Je wandelt nu in een powershell (dat hoeft niet als administrator) naar de directory met het HTML-bestand dat je wilt zien. Geef daar het commando:
    
    http-server
    
    Je kunt nu in je browser het bestand bekijken met:
    
    http://localhost:8080/index.html
    
    Uitgebreidere documentatie (die je eigenlijk niet nodig hebt) vind je op https://www.npmjs.com/package/http-server.

==> HTTPS werkt niet
[v] start locale webserver.

??? kan het geleidelijk? e.g. kunnen we modules importeren in niet-modules?

    Uncaught SyntaxError: import declarations may only appear at top level of a module

==> Nope. Can't import as non-module.
??? Ok, kan het dan zonder import?
==> Nope:

    jQuery.Deferred exception: createCanvas is not defined buildInjectionContext@http://localhost:8080/web/snake_student.js:23:1

Soooo. All or nothing. Either all modules or no modules. No gentle change. Why did I even expect different?

Oja, _wel_ even na ELKE FUCKING CHANGE de webserver herstarten. @W#$#$^%
==> OK, harde cache refresh CTRL-SHIFT-R werkt ook. Soms. Misschien.

https://stackoverflow.com/questions/3302959/how-to-restart-a-node-js-server

??? OK, maar andersom dan? dus van buiten naar binnen? Kan een module dependen op niet-modules?
==> Ja! Zowaar. Thank the gods for small favors.
===> Convert outside in.

(P 8)
[v] convert snake_student en tests.


*(&@#^%*&) 016 testen falen. Niet opgemerkt vanwege cache vervuiling.

(P 9)
[v] fix testen

    "Madness is trying the same thing twice and expect different results."
    -- Albert Einstein

It is official: Javascript is madness. Fucking kut cache.

[v] convert snake_game

    Uncaught SyntaxError: ambiguous indirect export: creategame

https://stackoverflow.com/questions/73813721/syntaxerror-ambiguous-indirect-export-default-error-when-importing-my-own-clas

Nope. It means: you typed createGame as creategame.
Uncaught JoostError: ambiguous illegible error message

[v] convert snake_player

(P 10)

[v] convert snake_engine
[v] convert snake_food
[v] convert snake_rule_set
[v] convert snake_snake

Dependencies only apply to CONSTANTS: no code dependencies, so nothing circular.

(p 11)
[v] convert snake_storage

    Loading module from “http://localhost:8080/test/snake_storage.js” was blocked because of a disallowed MIME type (“”).

Nope. It means: you forgot to adjust the directory.
Uncaught JoostError: ambiguous illegible error message

[v] convert snake_timer
[v] convert snake_random

http://localhost:8080/test/snake_unit_test_suite.html

(P 13)
[v] convert snake_canvas


### 2023-06-30
(P 1, 2)
[v] convert and break up mocks

(P 3)
[v] convert snake_board
[v] convert mocks to module

(P 4)
[v] convert snake_element

(P 5)
[v] convert snake_location

(P 6, 7)
[v] linting
Linting died (for each file):

    1:1  error  Parsing error: 'import' and 'export' may appear only with 'sourceType: module'

https://github.com/eslint/eslint/issues/5552

    You need to add sourceType: "module" to your config. There is no way for us to identify automatically what's a script and what's a module, so you have to provide that information in config file. For more details look in the documentation

https://eslint.org/docs/latest/use/configure/#specifying-parser-options
https://medium.com/tektalks/use-package-json-for-eslint-configurations-1208d5bcd0eb

fix: define command line parser options:
https://eslint.org/docs/latest/use/command-line-interface#--parser-options

(P 8)
[v] MVC ADR

### 2023-07-04

(P 1)
http://localhost:8080/web/snake.html
http://localhost:8080/test/snake_unit_test_suite.html


/**
	@function func(x,y) -> Return
	@desc
	@param {Type} name desc
	@return: {Type} desc
	@throws: {Type} desc
*/


We are required to say to return void from a command, even if void does not exist in Javascript (should be undefined)
Ach ja.

(P 2)

dit is ons illustere voorbeeld uit de uitgangscode dat de standaard neer moet leggen:

	/**
		@function drawElement(element, canvas) -> void
		@desc Tekent een element op het canvas
		@param {Element} element een Element object
	*/

Ik had *nooit* kunnen raden dat een Element typed element een element object is. Nooit. Gelukkig hebben we JSDoc.

(P 3)
OK, I've had enough of this.
Cut down on the uselessness.
Restrict to only three modules.

(P 4, 5, 6)

running tool:

	E:\files\studie\OU\Webapplicaties\Opdrachten\Opdracht2\IB1902_Webapplicaties\web\uitgangscode.js in line 65 with tag title "param" and text "{dom object} canvas het tekenveld": Invalid type expression "dom object": Expected "|" but "o" found.

==> Dit is wéér een focking voorbeeld dat niet klopt!

En nog meer: ELK VOORBEELD is incorrect! Functions worden niet annotated met hun arguments of return types:

https://jsdoc.app/tags-function.html

dus
	
	@function createElement

in plaats van

	@function createElement(location type) -> Element

Ben ik blij dat ik 'slechts' drie modules heb vervuild. 
Hoe durf ik ook te vertrouwen op de voorbeelden? Dom dom dom. Hahaha.


(p 7)
story _019-EXTRA-Pausing_the_game_

https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/

(P 8)
[v] player wraps directions in commands
[v] define pause command 

(P 9)
[v] game switches on a command type iso location

(P 10)
[v] player converts space to pause command
[v] game processes pause commands
[v] clean up NO_LOCATION
[v] engine stops/starts timer
[v] button captures space bar ==> focus on canvas
https://stackoverflow.com/questions/1829586/how-do-i-give-an-html-canvas-the-keyboard-focus-using-jquery

(p 11)
[v] engine state GAME_READY_STATE
[v] write paused on canvas

(p 12)
[v] handle game halt on paused game
[v] engine freezes input processing on pause

(p 13)
[v] move states from rule set to engine

(p 14)
story _020-EXTRA-Splash_screen_
[v] start command from enter


### 2023-07-05

(P 1, 2)
[v] BUG pause before game start => engine not defined
[v] introduce app states explicitly

(P 3, 4, 5, 6 ,7)
[v] engine should also shut down when game is paused.
[v] game does not start engine until start command

	100 tests completed in 82 milliseconds, with 0 failed, 0 skipped, and 0 todo.
	248 assertions of 248 passed, 0 failed.

100th test! woohoo!

(P 8)

game is started with new engine.
split? restart engine?
	==> reinitialize engine:
[ ] initialization with rule set after engine creation.
No op rule set as default
[ ] add gameFinished() check to state to allow engine to process the START_COMMAND
[ ] game calls start() on engine on START_COMMAND
	[ ] remove rules from constructor
	[ ] add rules to start
	[ ] build full engine and build game with engine.



### TODO

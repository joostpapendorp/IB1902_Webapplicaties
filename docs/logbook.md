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

(Pomodoro 1+2)

### TODO

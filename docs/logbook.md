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

[  ] styling choices --> ADR

[  ] copy code to clean file when needed, clearing the template slowly.

#### ??? Waar komt jcanvas vandaan? 
Index.html heeft geen js nodig, stond fout in templates. Ik denk dat het deze is (???) 

https://projects.calebevans.me/jcanvas/docs/

In de min versie via cloudfare komt Caleb Evans ook terug als auteur; inmiddels raad de site van hem zelf aan om de min via GitHub te downloaden: https://projects.calebevans.me/jcanvas/downloads/

Laatste versie is gelijk: 21.0.1. Support the author, dus via de site zelf.

templates are incomplete? (no stop)

(Pomodoro 1)

    As a side note, you cannot accurately set a canvas’s width and height via CSS; you can only do so through the canvas element’s width and height attributes.

    The resource from “https://raw.githubusercontent.com/caleb531/jcanvas/v21.0.1/dist/min/jcanvas.min.js” was blocked due to MIME type (“text/plain”) mismatch (X-Content-Type-Options: nosniff).

    How to Perform a Hard Refresh in Your Browser: Chrome, Firefox, or Edge for Windows: Press Ctrl+F5 (If that doesn’t work, try Shift+F5 or Ctrl+Shift+R).

(Pomodoro 2)

Ik weet niet hoe ik dit oplos, het kost tijd en is niet essentieel: Revert JCanvas to cloudfare source; dit werkt wel.

(Pomodoro 3)

[  ] import js module of via html?
    LEH 7 pp 163

(Pomodoro 4)

$("#mySnakeCanvas").clearCanvas() violates Demeter; no chaining in assignments.

(Pomodoro 5)

$("#mySnakeCanvas") geeft leeg jquery object na verplaatsing naar module object in snake_canvas.js --> onDocumentReady? lazy?

(Pomodoro 6)

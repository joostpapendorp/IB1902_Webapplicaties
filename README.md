# IB1902 Webapplicaties: de clientkant
This is the implementation of the second assignment for the Open University course.

### Workflow
We use a [trello boad](https://trello.com/b/djHvyLDG/ib1902-webapplicaties-opdracht-2) for story/issue tracking. We record our architectural decisions [here](./docs/adr/README.md) in [ADR format](https://adr.github.io/) using [phodals adr tools](https://github.com/phodal/adr). We maintain a [logbook](./docs/logbook.md) during development. This (and other) documentation is in [Markdown](https://www.markdownguide.org/) format. If your IDE/editor doesn't support a viewer, one can be found [here](https://github.com/KDE/ghostwriter/releases/tag/2.1.6). We adhere to our [Definition of Done](./docs/Definition-of-Done.md) before merging.

### Deploying the app
To start and run the app, open a prompt in the root directory (where this file is located).
Then start a local web server:
	
	> http-server

To start the app, open the following link: 

	http://localhost:8080/web/index.html

To run the tests, open the following link:

	http://localhost:8080/test/snake_unit_test_suite.html

To view the JSDoc documentation, first read [ADR 15](./docs/adr/0015-we-document-the-what-how-why.md) carefully.
Then open the following link:

	http://localhost:8080/docs/jsdoc/index.html
	

### Licensing
This template project is available under the GNU General Public Licence version 3 or later and users should adhere to the [exam regulations of the Open University](https://vraagenantwoord.ou.nl/privatedata/docs/Examenreglement%202019-2020%20DEF%20incl%20bijlagen.pdf)


### Maintainers
~~R. Bertossa~~ (Bertossa wasn't able to continue, [see log entry here](./docs/logbook.md))

J.R. Papendorp (852603068)

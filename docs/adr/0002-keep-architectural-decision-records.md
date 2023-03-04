# 2. We keep Architectural Decision Records

Date: 2023-02-17


## Decision

We use [ADRs](https://adr.github.io/) to record design choices. We use [Phodals adr tools](https://github.com/phodal/adr) to automate it.


#### Rinaldo is no longer a teammate
Even though the 'team' now only consists of Joost, we keep this structure for educational and demonstrational purposes.


## Context

Using Trello for our project planning and documentation does not inform about the decisions made during the project itself. ADRs are a means to fill that gap. This project is Javascript based.


## Demands

* Simplicity -- since this is but a small project, we mustn't overcomplicate things.
* Speed -- The administration for these decisions can't take too much time.


## Consequences and alternatives

Nodals tooling is node.js based, which fits the rest of our project. Although its development is in Chinese, its usage isn't and the documentation is clear and simple enough to understand and use. Other tooling is equally well suited, but uses additional computer languages.

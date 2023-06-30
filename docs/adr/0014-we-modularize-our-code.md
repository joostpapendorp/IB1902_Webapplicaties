# 14. We modularize our code

Date: 2023-07-01

## Context

We are explicitly required to modularize our code. We already have neatly partitioned our code base due to test-first requirements, but have not introduced modules We adhere to our hexagonal architecture. 

## Decision

We have split our app into separate modules, as per the diagram below. The diagram can be read as follows:

* [A] <>-- contains -- [B], an internal module dependency (UML notation)
* [A] --provides--o )---consumes---[B], a port-adapter interface (see [ADR 11](./0011-we-adhere-to-hexagonal-architecture.md))

Dashed lines denote usage without explicit dependency; that is to say, the module consumes an anonymous interface of another, without knowledge of or dependence on the context.

![modular design of the app](./modules.jpg)

There are no circular dependencies, i.e. if module A depends on module B, B does not depend on A. Thus, the dependency diagram forms a _tree_, generally flowing downward, from the input above to the output below, the root being _game_.

Please note (A), which would at first blush denote a cyclic dependency: Storage - Rules - Difficulties. However, this is not actually the case due to interface abstraction in [snake_student.js:50](../../web/snake_student.js). Storage has no knowledge of Difficulties. This roundabout construction is necessary due to the poor interface provided by IndexedDB (see [ADR 13](./0013-we-persist-using-an-indexed-database.md)). If we want to be able to let any rule set define its own database interaction scheme, we _must_ provide the database indices beforehand.

Another interesting interaction occurs at (B). _snake_student.js_, whose main job is to build the injection context of the app, binds external input handling directly onto _game_. In this way, it becomes the port for this input-adapter.

Lastly, note that Location has been omitted from this diagram for clarity.


## Alternatives

### Model-View-Controller architecture

Although this design adheres to all the demands made by the assignment on modular design, it does _not_ implement an MVC architecture. This is an active choice on our part.

The reason for this is that MVC, in its essence, is not intended for problems of this scope. If we return to [the roots of the MVC-design](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), we find that it is meant for _single input interactions_, e.g. the scope of a single text field.

This pattern has often been abused into full-blown architecture, and as such, has long been considered an anti-pattern. This is because it willfully separates state and operations, going against everything object-oriented programming stands for. [Martin Fowler](https://www.martinfowler.com/bliki/AnemicDomainModel.html) wrote about this over a decade ago. His work is apparently still relevant today.

While Javascript is not in itself an O-O language (it does not adhere to any paradigm), the design proposed by the course material broadly falls into this category: separating _mutable_ state from its operations.

Instead, we adhere closely to the principle of _locality_: code that needs to interact often should be grouped. In this case, state and operations.

In a broader sense, since we _do_ adhere to the underlying principles proposed by the assignment, one could 'squint' at our code and still see an MVC: view at the top and bottom of the hexagon, models and controllers coupled, but distinguishable in the core.  

We understand that we take a risk by ignoring a course requirement. We hope that we have sufficiently shown that we haven't done so lightly and that our motivation and design at least meet the underlying requirements, if not exceed them. At the very least, we do thoroughly comprehend the course material.

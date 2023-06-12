# 11. We adhere to hexagonal architecture

Date: 2023-06-12

## Context

We practice test-first development. This naturally partitions our app in different modules, since each is tested in isolation before it is created. In the same manner boundaries of the app are explicitly defined. This type of design maintenance is called _emergent design_ [Bain08].

We are required to make our designs explicit and document them.


## Decision

We adopt the [_Hexagonal architecture paradigm_](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)) to explicitly isolate our boundary interfaces from our own code. Currently, we have two types of ports:
* Native code, such as _setInterval_ and _Math_, and
* Dom tree interactions, such as _canvas_ and key input captures.

For each of these ports we write adapters, tuned to our specific needs.


### References

[Bain08]: Scott L. Bain, "Emergent Design: The Evolutionary Nature of Professional Software Development", 2008 

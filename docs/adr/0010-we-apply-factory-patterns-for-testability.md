# 10. We apply factory patterns for testability

Date: 2023-06-08

## Context

We can only use QUnit as a library. We are required to separate concerns. We want to test first our code. To modularize our code, we must be able to isolate its components. Constructing components within other components prevents us from mocking them in tests.

Traditionally, this problem is solved via [inversion of control (IoC)](https://en.wikipedia.org/wiki/Inversion_of_control) and [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) in OO-languages. In functional languages, this pattern is usually redundant, as functions can be passed as arguments and value-based programming (through [immutability](https://en.wikipedia.org/wiki/Immutable_object)) simplifies input-output testing. While this is technically feasible in Javascript, the entire setup of the course, including the setup for this assignment, advocates mutability and isolation; the Object-oriented approach to modularity.


## Decision

In our approach we remain close to the course material, by choosing the OO-approach to data hiding. We implement IoC manually through the injection of _factories_. For that we use the [_factory pattern_](https://en.wikipedia.org/wiki/Factory_method_pattern) from the [GoF](https://en.wikipedia.org/wiki/Design_Patterns). 

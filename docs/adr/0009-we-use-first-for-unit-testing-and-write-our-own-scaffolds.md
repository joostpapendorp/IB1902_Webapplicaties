# 9. We use FIRST for unit testing and write our own scaffolds

Date: 2023-05-25


## Context

We must use QUnit for automated testing. We must not use any additional javascript libraries.


## Decision

We write our unit test according to the FIRST (Fast, Independent / Isolated, Repeatable, Self validating, Timely) paradigm. 

This means we must be able to isolate the parts of the code we want to test. Traditionally we can use two approaches. Inside out or outside in. The first is used primarily for object-oriented languages, the second for functional languages. Javascript is neither with none of the advantages of either but having all the drawbacks of both.

Inside out feels like a better fit, since we are heavily encouraged to use mutable state and isolate it. This means a heavy use of mocking, but we aren't allowed to use mocking libraries and QUnit doesn't provide that functionality. We are forced to write our own, even if this is time-consuming.

Isolation is easier when we have inversion of control, but here too we aren't allowed any tooling. Luckily the project stack isn't that large, so we can manage manually as well. 

In addition, we must sometimes mock externals (like the .html elements), which mustn't interfere with other tests. QUnits own setup and tear down mechanisms involve [something called hooks](https://api.qunitjs.com/QUnit/module/#hooks) which is unknown to us. In respect to the time constraints it will be faster to write loan patterns for those (few) situations that require them, than to dive into QUnits arcane usage patterns. 

# 13. We persist using an indexed database

Date: 2023-06-29

## Context

The course requires us to demonstrate our skills in using persistent storage as an [explicit criterion entry](../Definition-of-Done.md). We aim to expand upon the difficulty rule
set by adding one or more other modes of play.


## Decision

We use an indexed database as the main means of persistence. We persist each game result individually --instead of keeping 
the tallies-- and aggregate using _count()_. 


### Database as a port

With the database being a port into our app (see [ARD 11](0011-we-adhere-to-hexagonal-architecture.md)), we chose to separate the database logic from the core and provide an interface to suited to our direct needs, on 
which we can expand when requirements change. 


### Blocking and async

This, unfortunately, necessitates blocking calls (using a _Promise_) and a slight permeation of 
a number of _async_ and _await_ statements into our core. We find that this relative minor intrusion is preferred above re-designing major portions of our app to facilitate the call-back architecture that the indexed database interface offers.


### Error handling

Error handling in our app is minimal. It consists of reporting the error to the console. We have deemed sophisticated error handling out-of-scope for the assignment. We believe to have demonstrated the basics of error handling in general with this approach. 

Moreover, more involved error handling would serve no purpose in our app, since the app has no relevant way to deal with these errors. There is no use case in which users would benefit from extra error handling. The chosen minimal approach serves the only purpose it could: informing debuggers with the relevant information of the error.


## Alternatives

### Local storage
The main alternative to an indexed database proposed by the course material is _local storage_. This is a simpler alternative and allows for a more free-form persistence scheme.

At first blush, this would seem like a better fit to our current needs, and indeed it is. However, since we plan for an extension of the rule sets and difficulty settings, this simplicity would soon become a burden instead. 

In general, it is considered an antipattern to overly generify the design to aim for an extension that won't ever be implemented. Moreover, our Hexagonal Architecture is exceptionally suited to swap out specific implementations of ports. This advocates strongly for the simpler solution, i.e. local storage.

In this case, however, the proposed extensions are relevant enough to weigh in our current decision-making. They are both _concrete_ (being fully defined as stories) as _timely_ (being near the top of the backlog). 

Moreover, first implementing the scheme using the local storage only to swap it for the indexed database isn't free. It requires some significant effort, not in the least since our knowledge of both indexed databases as local storage is still untested. In the interest of expediency, we take the risk of over-designing.

Finally, on a personal note, we found the indexed database to be the most challenging of the two options offered and wanted to test our skills.


### Storing and updating tallies 

Instead of registering each of the game results individually and then aggregating the tallies each time, we could simply store and update the tallies directly. This has several advantages:

* First, it would be the easier choice. It would register only two entries which are retrieved, then updated and finally stored.
* Second, it would be faster. A count over the entire game history takes more time than retrieving a single value from a table with a constant size of 2 entries.
* Third, it would be the closest fit for our current data need. At present, we aren't interested in the individual games, only in the tallies. 

Yet we chose to record games and tally manually. For this, we offer the following motivation.

* The easy (i.e. the least effort) choice isn't the simplest (cleanest, clearest) one. It compounds together two distinct concepts of _game result_ and _tally_. Simplifying in this case means losing access to each concept individually. This muddies the design and clarity of the app. This is important because the assignment requires us to write clean and comprehensible code. 
* Speed isn't a valid concern, and it won't be for the foreseeable future. The size of the table is equal to the number of games played. It will need to be spectacularly large to have an impact on performance. By that time, we will have other, more pressing performance issues.
* Compounding the results isn't a concern of the database port, nor that of the rule set. It would introduce another abstraction --say, _tally_--- tasked with this compression scheme (again, the easy solution isn't simple). This module needs to be written, tested and maintained.
* Our solution preserves history, while the simple solution doesn't. Updating in place (which the simple solution does) is, in its essence, a rewrite of history. It obscures the previous state. To preserve history in this case, we would, for instance, need to store each tally result individually and base each tally on the previous one. This complicates the solution to the point where it would be indistinguishable from our solution, without the benefit of clarity.

As an extra clarification, consider the following inconsistencies arising from choosing the simple solution:

* In the simple solution, the latest game results are stored *after* the tally has been retrieved. Our solution automatically defaults to the natural order: store the end of game, *then* calculate the tally.
* Bugs in the simple solution cannot be reproduced, since the only value present is the current state. It would be unknowable if the fault is because of the retrieving, tallying or storing. Since our tally is in the count, we have two measuring points for both the storing (database before and after) and the tallying (database and count result).


### Call-backs

The API of indexed database leans heavily on asynchronous call-backs. We have chosen to squash these call-backs by blocking execution and waiting on its results, using _async_ and _Promises_.

This is admittedly a compromise (see above). It would indeed be cleaner to use the API as intended. We do consider this a weak point in our overall design.

In our defense, the database is a 'mere' port into our app. Adopting the call-back structure would necessitate a rewrite of our core. This contradicts the adopted paradigm of Hexagonal Architecture, which states that changing ports should be possible without changing their interfaces.

Moreover, we discovered that the API of the indexed database is universally considered convoluted. See, for instance, [this](https://stackoverflow.com/questions/51119821/query-objects-on-index-idb?rq=3) and [this](https://stackoverflow.com/questions/49128292/indexeddb-wait-for-event
) posts on stack overflow dealing with the intricacies of a simple query. It offers an involved example of what we consider should be a straightforward operation.

We would have loved to use [the proposed library](https://github.com/dexie/Dexie.js) for our interactions, but we are explicitly forbidden to use any library other than JUnit. The chosen solution is a compromise to the available time and, not in the least, our own sanity.

# 6. use simple branching model as CI/CD

Date: 2023-02-17

## Decision

We use a simple branching model to maintain code.
* we don't automate the process
* no commits on main branch, only (no-ff) merges via pull requests.
* pull requests before each integration.
* each branch marks one feature and bear their trello-name and trello-number, e.g.:

> 002-Set_up_workspace

* each commit message references feature and tasks contained, e.g.:

> 002 Set up workspace.
>
> Add logbook. Update readme.md. Added Definition of Done.


## Context

The project is assessed, requiring that we demonstrate our processes and work. The project is small.


## Consequences and alternatives

GitHub provides the simple branching model, which is the de facto modern standard. The original Git Flow CI release scheme dates from before Continuous Delivery and is way too complex. Modelling our check in messages allows us to track the origin of code, which helps when expanding and troubleshooting. The examinator can use our git logs to track work done and processes. Installing hooks to automate the process is too much work for the scope of this project. 

# 7. Code is neatly styled.

Date: 2023-05-08

## Decision

We will apply uniform simple styling to the project. We will lint te project using:
* *html* http://validator.w3.org/
* *css* http://jigsaw.w3.org/css-validator/ en http://csslint.net/
* *javascript* ESLint https://eslint.org/docs/latest/
  Run using 

      npx eslint ./web > eslint_output.txt

## Context

One of the assessment requirements is programming style. The styling adhered to in the given starting code is subpar, but 
we can and should do better. The book adheres to the most common styling used. Linting is part of the offered course 
material for the html and css components. 


## Alternatives considered
The HTML and CSS checkers and the CSS linters are adopted from the [course site](https://youlearn.ou.nl/web/ib1902222322b/cursus/-/coursenavigator/361088016?_nl_ou_dlwo_courseview_WAR_nloudlwocourseplanportlet__facesViewIdRender=%2Fxhtml%2Fviewer%2FcourseNavigator.xhtml).

The course recommended [JSLint](https://www.jslint.com/) for Javascript. This linter is considered outdated. With permission from Sylvia Stuurman (mail dd. 2022-12-07), we replaced this with ESLint:

    *** JSLint ***
    Linting is een inherent goed iets, voor elke taal. Alleen ben ik het eens met meneer Internet (m/v/x) als die stelt dat JSLint verouderd is.
    Niet alleen zijn de stijlkeuzes onveranderbaar, maar stammen ook uit een andere tijd: 80 char screen width, indent using spaces, enforce if-braces; vroeger allemaal goede ideeën, maar nu niet meer.
    Modernere alternatieven zijn JSHint en ESLint, waarbij vooral de laatste wordt aangeraden: https://eslint.org/


## Consequences

Linting is adopted in the DoD.

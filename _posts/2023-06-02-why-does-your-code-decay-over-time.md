---
layout: post
title: Why does your code decay over time?
tags: quick-note refactoring clean-code abstraction
---

You have just created a function that was bulletproof. You think it will stay like this forever, with no need to change because it's just perfect?

But the next day a new requirement comes and you need to rewrite the whole thing.

This is only a single example of an unplanned change to the code. There are more reasons the code needs to change. We also need to:

- remove unused features
- upgrade libraries that evolve over time
- optimize due to changing runtime environments
- optimize due to changing usage patterns
- account for changes in technology or industry standards

Identifying these things is one thing but fixing them is another problem. Usually, the longer we wait to fix them, the bigger the problem becomes.

Hence the term: *DECAY*. Code decay leads to costly delays in development, increased maintenance costs, and a decrease in the quality of the software.

One way of dealing with this problem is to write the software in a way that is easy to refactor:

- not creating abstractions
- small functions
- pure functions
- separation of logic and side effects
- immutable values
- writing WHAT needs to happen instead of HOW it should happen 

Using these guidelines will make your code fun to change by your teammates! 


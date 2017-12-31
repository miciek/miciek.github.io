---
layout: post
title: "Best Scala talks I've seen in 2017"
tags: scala talks summary functional io type-level monad scalaz cats libra shapeless
---

This year has flown by very quickly, and what a year it was for Scala community! Since I watched dozens of talks this year and [attended quite a few conferences](/talks), I yet again decided to pick my favorite talks of the year! I hope that you will enjoy them just as much as I did. 

## Libra: Reaching for the stars with dependent types
A well-crafted introduction to [Libra](https://to-ithaca.github.io/libra/) - the *dimensional analysis library*. [Zainab Ali](https://twitter.com/_zainabali_) explains why we need dimensions for our numeric values and how this can help us safely send rockets to space. There are sightings of [Shapeless](https://github.com/milessabin/shapeless), dependent types and lots of educational code examples. Given at [Typelevel Summit Copenhagen](https://typelevel.org/event/2017-06-summit-copenhagen/).

<iframe width="560" height="315" src="https://www.youtube.com/embed/CrwVD0Pco5Q" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

*Pssst...* Be sure to also check out Zainab's latest talk from this year's [Scala eXchange](https://skillsmatter.com/conferences/8784-scala-exchange-2017): [Topiary and the art of origami](https://skillsmatter.com/skillscasts/10959-topiary-and-the-art-of-origami).

## The Design of the Scalaz 8 Effect System
2016's *"Scala Monad of the Year"* award went to *Free monad*. This year the award definitely needs to go to the **IO Monad**, which destroyed the competition and won by a landslide. In the talk given at [Scale by the Bay](http://scale.bythebay.io/), [John A De Goes](http://degoes.net/) describes the design of [Scalaz](https://github.com/scalaz/scalaz) new *IO*. Based on simple examples he shows how one can communicate with external effectful systems in pure, referentially transparent way.

<iframe width="560" height="315" src="https://www.youtube.com/embed/wi_vLNULh9Y" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

## The making of an IO
Since we have two competing functional-programming libraries in Scala ecosystem, [cats](https://typelevel.org/cats/) also needed the IO! New [cats-effect](https://github.com/typelevel/cats-effect) library is nicely introduced by [Daniel Spiewak](https://twitter.com/@djspiewak) in his [Scala.IO](https://scala.io/) talk.

<iframe width="560" height="315" src="https://www.youtube.com/embed/g_jP47HFpWA" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

*BTW*, the *"Scala Monad of the Year"* award is totally made up, so please do not approach me to accept the prize "on behalf of IO monad".

## Composing Programs
Beginner-friendly introduction to functional programming and how it helps with software compositionality. [Rúnar Bjarnason](https://twitter.com/runarorama) gives examples of composable software, talks about category theory, monoids, kleislis, functors, side effects and Minecraft. Highly recommended if you don't know why functional programming is getting so much traction. Given at [Scala eXchange](https://skillsmatter.com/conferences/8784-scala-exchange-2017).  

[Go to SkillCasts page to watch this talk](https://skillsmatter.com/skillscasts/10746-keynote-composing-programs).

## Honorable mention
This year's honorable mention is not a talk, but a very nice and [detailed article about asynchronous programming in Scala](https://alexn.org/blog/2017/01/30/asynchronous-programming-scala.html). Author of [Monix](https://monix.io/) library, [Alex Nedelcu](https://twitter.com/alexelcu) gives an overview of async programming with straightforward explanations.

## What do you think?
Well, that was fast! I feel like the [2016 version of this post](/2016/12/31/best-scala-talks-ive-seen-in-2016) was written just yesterday. I still think last year's picks are great and educational so please make sure you watch them!

It's obvious I missed at least one excellent talk from one of this year's conferences or meetups. Please let me know in the comments section below or [on Twitter](https://twitter.com/miciek). See you in 2018!


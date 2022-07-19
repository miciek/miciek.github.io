---
layout: page
title: Workshops
permalink: /workshops/
---

### Programming IO using the MTL style
The objective of the workshop is to get some theoretical and practical overview of the functional approach to IO-based programming. You will learn how to program real applications using Scala, Cats, Cats Effect, Cats MTL, Meow MTL, and others.

During the workshop, we will switch between quick introductions of the core features and longer step-by-step exercises. This will expose you to some features and tools needed to create and maintain production applications.

This event is open for all programmers that know the basics of FP in Scala (immutability, pure functions, higher-order functions, type classes).

1. Using `IO`.
2. Handling errors (`Option` / `Either` / `EitherT` / `ApplicativeError` / `FunctorRaise` / `MonadError`).
3. Handling State (`StateT` / `MonadState`).
4. Tagless final & MTL style.
5. Eithers in the business logic.
6. Using mutable reference (`Ref`).
7. Doing things concurrently (`Concurrent` / `Fiber`).
8. Purely functional waiting for values (`Deferred`).

##### Run at
  - [Kraków Scala User Group](https://www.meetup.com/pl-PL/Krakow-Scala-User-Group/events/265178928/) (October 2019)

### FP for Java programmers
If you have ever found yourself late at night debugging some impossible bug that "shouldn't have happened", only to find out that it was all about some obscure global state change, come join us and see what FP has to offer.

During this workshop, you will learn how to deal with your worst enemies: shared mutable state and code you can't trust. You will do a set of exercises that focus on dealing with these problems using Java whenever possible and Scala in more advanced cases. You will learn the two fundamental tools of functional programming: pure functions and immutable values.

This event is open for all programmers that know the basics of OOP in Java. Scala knowledge is not required. We will introduce & use only the very basic syntax constructs.

1. What is a function?
2. Exercise: Imperative vs Declarative
3. Functions in Scala
4. Exercise: Functions in Scala
5. Coding imperatively
6. Pure function: imperative vs functional
7. Exercise: Refactoring to a pure function
8. Pure functions and clean code
9. Exercise: Pure or impure?
10. Using Scala to write pure functions
11. Testing pure functions
12. Exercise: Testing pure functions
13. Mutability is dangerous
14. Exercise: Getting burnt by mutability
15. Shared mutable state
16. Dealing with the moving parts
17. Building our intuitions about immutability
18. Exercise: Immutable String API
19. Purely functional approach to the shared mutable state
20. Exercise: Practicing immutable slicing and appending
21. Exercise: Purely functional approach to the shared mutable state

##### Run at
  - [Kraków Scala User Group](https://www.meetup.com/pl-PL/Krakow-Scala-User-Group/events/263551356/) (August 2019)

### TDDing Functional Web Apps
Get some theoretical and practical overview of the TDD approach & Functional Programming by creating a multiplayer Pac-Man game server.

- First steps in Scala and Scalatest.
- Letting the tools help you (linting, scalafmt).
- Test Driven Development (baby steps, starting with the game logic and moving towards HTTP).
- Purely functional approach (separated data and behaviors, no exceptions, ADTs, Options).
- Modeling using immutable structures.
- Separating the concerns by using functions as input parameters.
- Using Monix Atomic to handle state.
- Using optics to deal with immutable changing data.
- Making impossible states impossible (design, refined types).
- Using function composition to connect all the dots.

##### Run at
  - *[Scala Sphere](https://scala.sphere.it/) (April 2018)*
  - *[Scalar](http://www.scalar-conf.com/) (April 2018)*
  - *[Lambda Days](http://www.lambdadays.org/) (February 2018)*

### Akka in Scala
Get some theoretical and practical overview of the actor model and asynchronous programming.

You will learn how to program real applications using Akka and Scala. Throughout the day we will switch between quick introductions of the core features and longer step-by-step exercises. This will expose you to all features and tools needed to create and maintain production applications. [[Details](/scala-summer-camp/#akka-in-scala)]

##### Run at
  - *[Scala Summer Camp](/scala-summer-camp) (August 2017)*

### Functional Architecture based on Free
Learn how to cut your applications into isolated, independent pieces using free monads. The session is based on a multiplayer, purely functional version of Prisoner’s Dillema.

You will learn how to program real applications using Free monad. Throughout the day we will switch between quick introductions of the new concepts and longer step-by-step exercises. This will get you an idea of how real-world purely functional applications look like. [[Details](/scala-summer-camp/#functional-architecture-based-on-free)]

##### Run at
  - *[Scala Summer Camp](/scala-summer-camp) (August 2017)*

### Building Snake using Streams
Learn how to create a real Snake game in the browser from scratch using reactive approach, immutable data structures, composable components and event streams.

I will show you how to create views without touching browser’s DOM, how to define app model without any mutable data structures and how to transform event spaghetti into nice declarative streams. And all that by implementing a game in the browser using React and Bacon, on top of fresh JavaScript specification (ES6). [[See the code](https://github.com/miciek/web-snake-react-bacon)]

##### Run at
  - *[SFI](http://sfi.org.pl) (March 2017)*

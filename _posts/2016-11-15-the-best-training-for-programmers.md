---
layout: post
title: "The best training for programmers: Coderetreat"
summary: 
tags: coderetreat training clean-code kata
---

Last month I facilitated the first internal Coderetreat at [my company](http://www.ocadotechnology.com). Coderetreat<sup>[1](#coderetreat)</sup> is a day-long training for programmers that focuses on clean code and simple design. Even though it's one of the best possible trainings for a professional developer, it's still not very popular amongst software companies. Let me show you how one training day looks like and what's in it for you.

## The Perfect Day
Group of 10-12 people gather together in one room with only one computer per pair. Before any coding starts, facilitators do a short 10-minute introduction<sup>[2](#intro)</sup> about *not* getting things done and *perfect code*.

### Introduction: Getting things done - NOT!
All things we do in our day job are constrained by deadlines and various pressures. We want to get things done, to deliver something. That means we need to cut corners. And if we cut them consciously, we are not doing our best, we are not performing at the best possible level. 

Everybody has a personal level of perfection, but majority of us don't really know where it is. Coderetreat training will help attendees see their **perfect code**.

![Your personal pyramid of perfection](/images/the-best-training-for-programmers/perfection-pyramid.png)

During the day, you will do 6 short programming exercises (katas), each 45 minutes long. You don't have to finish any of them, it's not something we aim for. The main objectives are different:

- see **your** perfect code,
- see perfect code that others wrote,
- learn new things,
- share the knowledge,
- have fun.

That means:

- If you write just one line of code during the day, it's ok - as long as it's *the perfect line of code*.
- If you write a not-so-perfect line of code, don't worry... You will delete it very soon and you will be able to start over. 

You can have your own definition of *perfect* and work with that definition throughout the day. However, facilitators also provide a hint of what perfect could mean for many programmers. And this is where [4 rules of simple design](
http://martinfowler.com/bliki/BeckDesignRules.html) come in. The perfect (simple) code should:

- pass all tests, 
- reveal intention,
- contain no duplication,
- have fewest elements possible. 

All other software design rules (like KISS, DRY) can be derived from those 4 simple ones. 

### The format
Real *fun* starts just after introduction and lasts until the end of the day. There are 6 coding sessions. In each of them we do the same exercise (e.g. implementing [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) or Pacman) from scratch, but with different constraints. We do them using [pair programming](https://en.wikipedia.org/wiki/Pair_programming) and [Test Driven Development](http://martinfowler.com/bliki/TestDrivenDevelopment.html). Each session ends in the same way:

- Everybody *deletes the code* to make room for new ideas in future sessions.
- We gather together for a short *retrospective*. We talk about what went well and wrong, share our experiences.
- Then we *swap pairs* to keep things fresh (and maximize the learning factor).

At the end of the day we do a longer retrospective called *Closing Circle*.

## The sessions and constraints 
Facilitators need to choose constraints separately for each particular group of programmers, based on their experience. For the first internal Coderetreat we chose:

- Session #1: Ping Pong (Basic)
- Session #2: No Mouse (Missing Tool)
- Session #3: Immutables Only (Quality Constraint) 
- Session #4: Mute with Find the Loophole (Stretch)
- Session #5: Tell Don’t Ask (Quality Constraint)
- Session #6: No Conditionals, No Loops (Missing Feature)

I'd like to briefly describe what each constraint is and why it may be useful.

### Ping Pong
The first session is very simple. We just let people learn the problem domain, talk it over. We also let attendees exercise the basics of Test Driven Development using the *Ping Pong* technique. Ping pong is one of the most effective TDD activities. The rules are simple:

- work in pairs,
- person A only writes tests (test code only),
- person B only tries to get the tests to pass (production code only),
- both refactor when appropriate.

Even if the group consists of non-TDDers, they all tend to grab the concept of Ping Pong very quickly. Majority of them uses this technique in all the following sessions.

### No Mouse
Then we want to kick people out of their comfort zones. We don't allow any mouse usage (nor the touchpad). As a bonus, if there are *vim ninjas* or *IntelliJ masters* in the room, people can learn a lot from them.

### Immutables Only
Next we want to help developers practice design using immutable objects. They learn how can this helps write better code. Nowadays this is a natural approach for many people. However, the constraint is very strict (really, **no mutable classes at all**), so this is still a nice challenge to do just before lunch.

### Mute with Find the Loophole
This is a great exercise on making expressive code & tests. There are just 3 rules:

- use *Ping Pong* technique,
- *Mute* - nobody can talk!
- *Find the Loophole* (aka Evil Coder) - one person intentionally writes the simplest possible algorithm (most of the time: the wrong algorithm) that still makes the tests turn green. The key is to keep the code very clean all the time. 

It is a very fun session and a nice one to do after the lunch. People learn how to communicate using a well written code. When somebody feels the urge to explain something verbally, it means the code is not expressive enough. Many people say that this is the session that makes them write the best solution.

### Tell Don't Ask
No getters, no properties, no functions with return values. 

This exercise can have few different forms. The easiest one is to allow bundling everything in objects and just tell the objects what to do. This is a nice exercise on Object Oriented Programming. 

Alternatively, facilitators can forbid any variable reads. That can generate some extreme solutions. It's also a nice trigger for discussions about callbacks, actors, code as data and how TDD can get in the way sometimes.

### No Conditionals, No Loops
That is another hard exercise for many programmers. You are not allowed to use any explicit conditionals or any loops. Attendees learn and practise how to use higher-level abstractions to write better code. Facilitators tend to give more hints during this session, like *"try using recursion"*, *"try using pattern matching"* or *"try using polymorphic structures and virtual methods"*. 

## Closing Circle
After the sixth session we do the last retrospective of the day, called *Closing Circle*. We talk about surprises, learnings and how do we plan to apply them in our work. Very often people say that TDD proves to be very useful and they will try to use it more. There are also lots of people that change their mind about pair programming. We also hear that people really learned a lot new things and are really tired. 8 hours well spent!

## Coderetreat in your company!
Being able to test different design and development approaches without the pressure of *getting things done* is the main reason to attend the training. It gives you a fresh look at things you and others do in your job. If you are a programmer, let your boss know about the idea of Coderetreat. If you are a boss, try organizing regular Coderetreats and make sure everybody can attend.

---
<small><a name="coderetreat">1</a>: The idea for [Coderetreat](http://coderetreat.org/about) was spawned by Gary Bernhardt, Patrick Welsh, Nayan Hajratwala and Corey Haines.</small>

<small><a name="intro">2</a>: Every facilitator does a slightly different introduction. You can view [the video](https://vimeo.com/18955165) of Corey Haines doing the introduction to a Coderetreat he facilitated.</small>

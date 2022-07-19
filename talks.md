---
layout: page
title: My Talks
permalink: /talks/
---

Here is the list of my talks with links to videos, slides and code repositories:

### Immutability Against The Machine
Immutability has taken over the software world. Programmers are using immutable values to make their products more maintainable. They are able to focus on higher-level architectural problems instead of hard-to-debug accidental mutations.

However, the software we write often needs to run on a real machine. It needs state, it needs to do many things at once using multiple threads, and it needs to acquire some resources like sockets or files. Moreover, it needs to clean after itself in any condition, even when things go awry, making sure it never leaks memory or resources. We may be tempted to say that solving these concerns requires some old-school mutations. But it doesn’t!

In this talk we will show a real-world application that uses state, multiple threads, and resources. We will use real data from an external Wikidata service, make sure we conform to the API limits, implement a cache, and make sure we release all unneeded connections along the way. Most importantly, all this is going to be modelled as immutable values!

  - [Slides](https://speakerdeck.com/miciek/immutability-against-the-machine)
  - [Code](https://github.com/miciek/immutability-against-the-machine)

##### Given at
  - *[JBCNConf](http://www.jbcnconf.com/2022/) (July 2022)*
  - *[Devoxx PL](http://www.devoxx.pl) (June 2022)*

### Fast & Functional
In this talk we are going to create a functional and blazingly fast microservice. We will use functional programming abstractions to quickly mix & match different HTTP libraries, state implementations and concurrency configurations. Each step will be followed by a performance analysis using different tools from JVM toolbox. This talk is for you if you want to see how cats IO monad, async-profiler, flame graphs and wrk are used together to create microseconds-fast Scala service for YouTube videos statistics.

  - [Slides](https://speakerdeck.com/miciek/fast-and-functional-66b89d68-5d8c-4d2b-9bc2-5fa4adf16734)
  - [Code](https://github.com/miciek/influencer-stats)

##### Given at
  - *[Scala Matsuri](https://2019.scalamatsuri.org) (June 2019)* (long, slow version) [[Video](https://www.youtube.com/watch?v=L9-C33sHIhU)] [[Slides](https://speakerdeck.com/miciek/fast-and-functional-scala-matsuri-jp)]
  - *[Geecon](https://2019.geecon.org/) (May 2019)* [[Video](https://www.youtube.com/watch?v=tXrnnysRSYc)]
  - *[JPoint](https://jpoint.ru/) (April 2019)* [[Video](https://www.youtube.com/watch?v=C1QiYjAbrb0t5JZNS)]
  - *[Lambda Days](http://www.lambdadays.org) (February 2019)* [[Video](https://www.youtube.com/watch?v=xAhrgxUeOvY)]
  - *[coredump](http://coredump.events/2018/) (November 2018)*

### Tear down this pyramid... using functions and meshes
In this live coding talk you will learn about techniques you can use to better test your microservice architecture. We will build a stateful HTTP-based Pac-Man game engine from highly isolated and testable components using pure functions, type parameters, side cars and service meshes.

I will build a stateful HTTP API from highly isolated components that are easier to test than entangled spaghetti-like codebases. I will show you how tests can help us scaffold the architecture and how should we approach testing in the era of microservices. In the session I will use immutability, type parameters and function parameters as tools to implement a very practical example: Pac-Man collectibles microservice. I will code in Scala using Akka HTTP and deploy to Kubernetes with [Linkerd](https://linkerd.io) service mesh.

  - [Slides](https://speakerdeck.com/miciek/tear-down-this-pyramid-dot-dot-dot-using-functions-and-meshes)
  - [Service Code](https://github.com/miciek/pacman-collectibles)
  - [Deployment Code](https://github.com/miciek/pacman-kubernetes-linkerd)

##### Given at
  - *[Agile & Automation Days](http://aadays.pl/) (October 2018)*
  - *[JDD](https://jdd.org.pl) (October 2018)* [[Video](https://www.youtube.com/watch?v=erf-Y2sb9SY)]
  - *[Geecon](https://2018.geecon.org/) (May 2018)* (first version) [[Video](https://www.youtube.com/watch?v=2iX5gH2zWbs)] [[Slides](https://speakerdeck.com/miciek/building-testable-apis-using-functions-and-meshes)] [[Code](https://github.com/miciek/pacman-multiplayer-fp)]

### Freestyle, Free & Tagless: Separation of Concerns on Steroids
You will learn how to cut your applications into isolated, independent pieces using Freestyle library with free monads or tagless final style. The session is based on a multiplayer, purely functional version of Prisoner’s Dillema.

Our applications frequently consist of business logic, communication, persistence, caches & logging. We always want to keep them apart and reason about each of them individually. However, this is very difficult to achieve in practice.

Enter free monad. It lets us decouple those concerns by dividing our program into algebras and interpreters. I will show you an application built on top of free monad in Scala & Cats. You will learn how to create pure & declarative DSLs, side-effecting interpreters and how to use them together. Then I will introduce Freestyle library and show how it makes the code more concise. At the end I will compare the free monad approach to another technique used to decouple concerns: final tagless.

  - [Slides](https://speakerdeck.com/miciek/freestyle-free-and-tagless-separation-of-concerns-on-steroids)
  - [Code](https://github.com/miciek/free-prisoners)

##### Given at
  - *[Scala UA](http://www.scalaua.com) (April 2018)* [[Video](https://www.youtube.com/watch?v=-4lB5EKS5Uk)]
  - *[Lambda Days](http://www.lambdadays.org) (February 2018)* [[Video](https://www.youtube.com/watch?v=-jlLkTtgWUk)]
  - *[Kraków Scala User Group](http://www.meetup.com/Krakow-Scala-User-Group/) (February 2018)* [[Video PL](https://www.youtube.com/watch?v=1FEFpk-uIYo)]
  - *[Scala eXchange](https://skillsmatter.com/conferences/8784-scala-exchange-2017) (December 2017)* [[Video](https://skillsmatter.com/skillscasts/10961-freestyle-free-and-tagless-separation-of-concerns-on-steroids)]

### Developer on Detox
Let's meet John Craft - a great software craftsman. Today is his last day at work before long holidays. John has just given his functionality to review and wants to leave at 6:00 PM.

This is a story of a code review, in which the reviewer found a few unfortunate issues at the worst possible time - 5 minutes before the holidays.

Let’s put ourselves in John's shoes and try to decide what is the best solution for a true craftsman, who is interested in both quality and good design. I will talk about illusions, intuition, and decision making.

  - [Slides](https://speakerdeck.com/miciek/developer-on-detox)

##### Given at
  - *[BBQ4.IT](http://bbq4.it/) (September 2017)*
  - *[Confitura](https://2017.confitura.pl/) (July 2017)* [[Video PL](https://www.youtube.com/watch?v=O3MB56R_eqw)]
  - *[Quality Excites](https://qualityexcites.pl/) (June 2017)* [[Video PL](https://www.youtube.com/watch?v=19G0Iqz24g8)]
  - *[Boiling Frogs](http://www.boilingfrogs.pl) (February 2017)* [[Video PL](https://www.youtube.com/watch?v=sQ88r0Ri3M0)]

### Pragmatist's Guide to Functional Geekery
Basic functional concepts like immutable data, second-order functions, lambdas and function composition can already be found in the modern programmer’s toolkit. 

During this talk you will learn about more advanced functional concepts and how they can solve real problems. I will talk about pattern matching, algebraic data types, functional abstractions, folding and property-based tests. 

I will show you a practical example written using today’s Java functional constructs and build up from there. I will use only Java & Vavr, which can improve the code, make it more maintainable and testable. 

  - [Slides](https://speakerdeck.com/miciek/pragmatists-guide-to-functional-geekery)
  - [Code](https://github.com/miciek/galactic-twitter)

##### Given at
  - *[Devoxx Community Day](http://www.devoxx.pl) (June 2017)*
  - *[Devoxx PL](http://www.devoxx.pl) (June 2017)* [[Video](https://www.youtube.com/watch?v=0o3yJ5HbkAU)]
  - *[JBCNConf](http://www.jbcnconf.com/2017/) (June 2017)* [[Video](https://www.youtube.com/watch?v=r9rd86lZCK4)]
  - *[jPrime](http://jprime.io) (May 2017)* [[Video](https://www.youtube.com/watch?v=tMwXjqJtq1Q)]
  - *[Geecon](http://geecon.org) (May 2017)* (no live coding) [[Video](https://www.youtube.com/watch?v=9TDonyktXdY)]
  - *[Devoxx UK](http://www.devoxx.co.uk) (May 2017)* (no live coding) [[Video](https://www.youtube.com/watch?v=3bkb6U5jJbs)]

### I can haz no Futures?
Learn how simple functional patterns can be used to make your business logic cleaner and more testable.

Asynchronous programming brings a lot of Futures to your code. Bad news is that they are not essential to what your application really does… You end up with Futures of assertions in your unit tests or, even worse, with Await or expectNoMsg calls.

This is a live coding talk. First I will code an application using Futures in both business logic and unit tests. Then I will get rid of Futures without losing asynchronicity. In the second part, I will do a step by step refactoring of a simple Akka actor system. In both cases I will use typeclasses from [Cats library](http://typelevel.org/cats/).

  - [Slides](https://speakerdeck.com/miciek/i-can-haz-no-futures)
  - [Code](https://github.com/miciek/playing-with-cats)

##### Given at
  - *[Warsaw Scala Enthusiasts](https://www.meetup.com/WarsawScala/) meetup (April 2017)*
  - *[Lambda Days](http://www.lambdadays.org) (February 2017)* [[Video](https://www.youtube.com/watch?v=aMHN82g_dxU)]
  - *[Techees @ Ocado Technology](https://www.meetup.com/Ocado-Technology/) meetup (January 2017)*
  - *[Kraków Scala User Group](http://www.meetup.com/Krakow-Scala-User-Group/) (November 2016)* [[Video](https://www.youtube.com/watch?v=EHQXLp2YL2M)]

### Building muliplayer game using Streams
In this talk you will learn how stream-based programming can be used to implement web frontend and multiplayer backend of the classic game: Snake.

Building dynamic applications using imperative approach tends to create lots of unmaintainable code. Stream-based programming tries to solve this problem by introducing fully declarative way of defining application logic. While using streams, you will focus on WHAT needs to be done, not HOW and WHEN. 

The talk is divided into 3 parts. In the first part you will learn how to create a frontend of the Snake web game using streams as building blocks. Then, we will move to the server side and use Scala and Akka Streams library to create backend service that will allow the game to be played by multiple players. In the third part, we will discuss reactive streams and how they make asynchronous communication safe.

  - [Slides](https://speakerdeck.com/miciek/building-multiplayer-game-using-streams-v2)
  - [Frontend Code](https://github.com/miciek/web-snake-react-bacon)
  - [Backend Code](https://github.com/miciek/snake-multiplayer-akka-streams)

##### Given at
  - *[ReactSphere](https://reactsphere.org/) (March 2017)* [[Video](https://www.youtube.com/watch?v=BIU1Sg67FN8)]
  - *[Scala eXchange](https://skillsmatter.com/conferences/7432-scala-exchange-2016#overview) (December 2016)* [[Video](https://skillsmatter.com/skillscasts/8979-building-multiplayer-game-using-streams)]
  - *[Code Europe](https://www.codeeurope.pl) (December 2016)*
  - *[Topconf Tallinn](http://topconf.com/tallinn-2016/) (November 2016)*
  - *[Voxxed Days Belgrade](https://belgrade.voxxeddays.com/) (September 2016)* [[Video](https://www.youtube.com/watch?v=u7Ab7UDfWdQ)]
  - *[JavaOne](https://www.oracle.com/javaone/) (September 2016)*
  - *[SF Scala meetup](http://www.meetup.com/SF-Scala/) (September 2016)* [[Video](https://www.youtube.com/watch?v=VZWxFDqDV28)]
  - *[Scalapolis](http://www.scalapolis.pl) (September 2016)*
  - *[Devoxx UK](http://www.devoxx.co.uk) (June 2016)* [[Video](https://www.youtube.com/watch?v=iKTFalVfoSU)]
  - *[Geecon](http://geecon.org) (May 2016)* [[Video](https://vimeo.com/185781741)]
  - *[Meet.js Summit](http://summit.meetjs.pl) (March 2016)* [short version] [[Video](https://www.youtube.com/watch?v=JdOpkQ-dMxo/)]
  - *Kraków Scala User Group (February 2016)* [[Video PL](https://www.youtube.com/watch?v=MKEbuLsah50)]
  - *[Boiling Frogs](http://www.boilingfrogs.pl) (January 2016)* [[Video PL](https://www.youtube.com/watch?v=J8n8j0_6wYU)]

### Purely Functional Web Apps
Are you familiar with the following recipe? 

  - First define an API and its documentation. 
  - Then take the API and create its server implementation. 
  - Then create a client for the same API, but in JavaScript land. 
  - Then imperatively modify the browser’s DOM in order to allow user to do and see stuff. 

Sounds about right?

During this talk you will forget about all these things and become a functional web developer. I will show you how to write type-level web APIs, purely functional server and client implementations and how to render things without touching browser’s DOM.

The talk is divided into two parts: backend & frontend. The first part of the talk will introduce the concepts behind haskell-servant and we will implement a simple web app backend. Then we will code the app itself using Elm and reactive approach.

  - [Slides](https://speakerdeck.com/miciek/purely-functional-web-apps)
  - [Backend Code](https://github.com/miciek/mr-stats-haskell-servant)
  - [Frontend Code](https://github.com/miciek/mr-stats-frontend-elm)

##### Given at 
  - *[Haskell eXchange](https://skillsmatter.com/conferences/7276-haskell-exchange-2016) (October 2016)* [short version] [[Video](https://skillsmatter.com/skillscasts/8892-purely-functional-web-apps-with-servant-and-elm)]
  - *[Lambda Days](http://www.lambdadays.org) (February 2016)* [[Video](https://www.youtube.com/watch?v=oMfF9V52DT4)]
  - *Lambda Lounge (February 2016)*

### Sane Sharding with Akka Cluster
Writing distributed applications is very hard, especially when you start developing them as single-noded ones. Programmers tend to focus on functionalities first, leaving the scalability issues for later. Fortunately, Akka gives us many tools for scaling out and we can use them very early in the development process. You will learn how to take advantage of these features.

The talk is divided into two sections. In the first section you will learn how to transform a single-noded app into a scalable one. During live coding session we will create both versions from scratch and guide you through the most important architectural decisions. 

Then we will move on to more important problems. During the second section we would like to simulate missile defence system and protect planet Earth against hostile aliens. Under the hood there will be Scala and Akka Cluster with sharding extension. After describing the application and its internals, we will simulate network and power failures to provide some idea how fast the application can recover.

Under the hood there will be Scala and Akka Cluster with sharding extension. Akka is a great toolkit for creating reactive applications, but it shows its full capabilities when it is run in a cluster.

  - [Slides](https://speakerdeck.com/miciek/sane-sharding-with-akka-cluster)
  - [Code](https://github.com/miciek/akka-sharding-example)

##### Given at
  - *[Voxxed Days Belgrade](https://belgrade.voxxeddays.com/) (September 2016)* [[Video](https://www.youtube.com/watch?v=PEh7wADUKuQ)]
  - *[jPrime](http://jprime.io) (May 2016)* [[Video](https://www.youtube.com/watch?v=f06Otw_DuQU)]
  - *[33rd Degree 4 Charity](http://www.33degree.org) (December 2015)*
  - *[JDD](http://www.jdd.org.pl) (October 2015)* [[Video](https://www.youtube.com/watch?v=2oYytf5Y1rY)]
  - *[Kraków Scala User Group](http://www.meetup.com/Krakow-Scala-User-Group/) (April 2015)* 

### Reactive UI by example
A live coding of Snake game using JavaScript, React and streams.

  - [Code](https://github.com/miciek/web-snake-react-bacon)

##### Given at
  - *[Meet.js Kraków](http://meetjs.pl) (January 2016)* [[Video PL](http://krakow.meetjs.pl/160112/)]

### Typeclasses in a galaxy far, far away
Introduction to typeclasses.

  - [Slides](http://slides.com/miciek/typeclasses#/)

##### Given at
  - *[Kraków Scala User Group](http://www.meetup.com/Krakow-Scala-User-Group/) (March 2015)* [[Video PL](https://www.youtube.com/watch?v=v-gT4Z82CF4)]

---
layout: post
title: Should you use microservice architecture?
date: 2014-12-13 04:42
summary: In 2014 microservices went mainstream. However we still don't know anything about how microservice projects are maturing over time, so we need to be very cautious when considering them. In fact, it is still recommended to use monoliths.
tags: microservices how-to
---
In 2014 microservices went mainstream. However we still don't know anything about how microservice projects are maturing over time, so we need to be very cautious when considering them. In fact, it is still recommended to use monoliths.

Martin Fowler is particularly known for challenging microservice architecture. He has published [series of articles](http://martinfowler.com/tags/microservices.html) over last few months and has recently spoken on XConf. I summarized one of his article in the blog post called [What are microservices?]({% post_url 2014-07-21-what-are-microservices %})

###What are microservices?
Microservices architectural style is just something different to what we have been doing since 1990s. We built application using layers (UI, middle-tier business logic, database, etc) and usually one layer's responsibility was far bigger than the other ones.

When we use microservices, a single app consists of services. Each of them is built around business capability and can be independently deployed. No central "module" is responsible for any of those services.

Technically you should assume that each service runs in its own process and communicates by some lightweight mechanism (like HTTP) and has its own persistence solution. Services may be of different size, but optimally they should be developed (and supported) by a team that can be fed by 2 pizzas ;).

###Ponies are shot at you from a rainbow
...when you use microservices of course!

1. **You can deploy the application partially.** Changes in one service are highly independent from another services.
1. **Keeping modularity is easier.** You keep the components (i.e. services) loosely coupled, because each of them has a strict published interface.
1. You can use **different technologies** for different tasks.
1. **You support DevOps culture.** People are more involved, because they are responsible for a full-stack functionality.
1. **You get closer to Continuous Delivery.** It's easier to automate as many things as possible, because there aren't any huge and complicated global dependencies.
1. **Teams have better understanding of their components.** Microservice teams are far better in logging and monitoring, because it's the only way they can know what is going on inside.
1. **Application is designed for failure and it scales well.** Services are smaller and are easier to reason about.

###Where is the catch?
1. **Microservices are slower.** Services communicate over more expensive channel than components in monolithic application (e.g. HTTP vs in-process calls).
1. **Refactoring is harder.** Moving responsibilities between services is harder.
1. **You only have eventual data consistency**. Data management is decentralized in microservices, so you cannot guarantee consistency using transactions.
1. **Debugging a set of services is hard.** The only way to know, what is going on in a set of services is to have a very good logging and monitoring solution.
1. It's very **hard to prototype** using microservices, because of all changing APIs.

Remember that there are always trade-offs in decisions like that. Monolithic applications are still simpler to built. The best way is to start with monolithic unless [you are completely sure](http://martinfowler.com/bliki/MicroservicePrerequisites.html) that you need to use microservices. You can always switch to them later on, when the requirements and APIs are more stable.

---
layout: post
title: What are microservices?
date: 2014-07-21 0:06
summary: You've been hearing a new buzzword for some time now. Microservices architecture is a new shiny thing in software world. This post summarizes Martin Fowler's take on this topic.
tags: microservices
---

You've been hearing a new buzzword for some time now. Microservices architecture is a new shiny thing in software world. This post summarizes [Martin Fowler's take on this topic](http://martinfowler.com/articles/microservices.html).

For software to have a **microservice architecture**, most of the following 9 characteristics should be implemented:

1. **Componentization via services** instead of libraries. Libraries are components linked into the program while services are out-of-process components. We achieve independently deployable components and strict published interfaces.
1. **Organization around business capabilities** helps to keep the morale and motivation high. Services should be responsible for full-blown business capability, therefore the team works closer to DevOps culture.
1. **Products not projects** approach also supports DevOps culture. "You build it, you run it". It is easier to do this approach using services.
1. **Smart endpoints and dump pipes** allow us to focus only on logic in the components. Communication between components should be as dump as possible.
1. **Decentralized governance** means that each service is responsible for itself (organizationally and technologically). Each team can choose the technology and tools for their service.
1. **Decentralized data management** means that each service can have its own view on the world. They can store data in different models and storages.
1. **Infrastructure automation** helps achieve continuous delivery which aims to make each deployment boring ("If it hurts, do it many times.").
1. **Designing for Failure** helps you make more reliable services. Any service can be terminated or fail or disconnect or... You should prepare for that. If you think you are well prepared, please try to run [Chaos Monkey](http://techblog.netflix.com/2012/07/chaos-monkey-released-into-wild.html) and see if you hesitate ;).
1. **Evolutionary design** is very convenient in microservice approach. You have strict decomposition, services are easily replaceable.

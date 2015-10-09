---
layout: post
title: Scalability using Sharding from Akka Cluster
date: 2015-10-10 09:00
summary: This tutorial explains how can we easily transform our application into clustered one with the help of Akka toolkit.
tags: how-to akka scala sharding scalability
---
Writing distributed applications is very hard, especially when you start developing them as single-noded ones. Programmers tend to focus on functionalities first, leaving the scalability issues for later. Fortunately, Akka gives us many tools for scaling out and we can use them very early in the development process. You will learn how to take advantage of these features by transforming single-noded non-scalable web service into a scalable one.

## Our case: The Conveyor Junction Web Service
Imagine we want to write a web service that is called each time a container appears on the junction of the conveyor.

![Conveyor Split]({{ site.url }}/images/shoesorter.gif)

This web service is going to define one endpoint, which will be hit each time a container is scanned before the split. The endpoint should return an id of the target conveyor. The container will be then pushed onto target conveyor by the hardware.

`GET /junctions/<junctionId>/decisionForContainer/<containerId>` returns

{% highlight json %}
{
  "targetConveyor": "<conveyorId>"
}
{% endhighlight %}

Initial setup (what we already have):
- the `Container` storage that we can query,
- the `whereShouldContainerGo` function which returns the decision for a `Container` passed as one of the parameters (aka *business logic*).

We need to implement an HTTP Service which uses a storage and business logic function and glues them together.

## I will use Akka
I will use plain Akka, no additional extensions, especially no clustering (yet). Just simple app running on one JVM. I want to show that even without thinking about scalability, it is still reasonably easy to add it later. I will be able to do this just because of the right choice now.

## Step 1: Defining domain and internal API
Let's define what language our components (actors) will use to communicate and how our domain will be modeled. This can be easily represented using Scala case classes:

{% highlight scala %}
object Domain {
  case class Junction(id: Int)

  case class Container(id: Int)
}
{% endhighlight %}

We have only two domain objects. One represents a `Junction`, the other one represents a `Container`.

{% highlight scala %}
object Messages {
  case class WhereShouldIGo(junction: Junction, container: Container)

  case class Go(targetConveyor: String)

  object Go {
    implicit val goJson = jsonFormat1(Go.apply)
  }
}
{% endhighlight %}

The message `WhereShouldIGo` will be send to the actor responsible for making a decision.

Our service won't receive any JSON data, it will just return JSON object. I called this object `Go(targetConveyor)`. It will be automatically marshaled into JSON thanks to the implicit default conversion defined in its companion object.

## Step 2: Creating REST Interface layer
Now it's time to code something real. To implement our HTTP service I will use `akka-http` with `spray-json`. It will only define our one endpoint and based on the passed parameters, it will send asynchronously a `WhereShouldIGo` message to the actor named `decider`.

{% highlight scala %}
object RestInterface {
  def bind(decider: ActorRef, exposedPort: Int)(implicit system: ActorSystem): Future[ServerBinding] = {
    implicit val timeout = Timeout(5 seconds)

    val route =
      get {
        path("decisions" / IntNumber / IntNumber) { (junctionId, containerId) =>
          complete {
            decider
              .ask(WhereShouldIGo(
              Junction(junctionId),
              Container(containerId)))
              .mapTo[Go]
          }
        }
      }

    implicit val materializer = ActorMaterializer()
    Http().bindAndHandle(route, "0.0.0.0", exposedPort)
  }
{% endhighlight %}

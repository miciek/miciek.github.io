---
layout: post
title: Scalability using Sharding from Akka Cluster
date: 2015-10-10 09:00
summary: This tutorial explains how we can easily transform our application into clustered one with the help of Akka toolkit.
tags: how-to akka scala sharding scalability
---
Writing distributed applications is very hard, especially when you start developing them as single-noded ones. Programmers tend to focus on functionalities first, leaving the scalability issues for later. Fortunately, Akka gives us many tools for scaling out and we can use them very early in the development process. You will learn how to take advantage of these features by transforming single-noded non-scalable web service into a scalable one.

## Our case: The Conveyor Junction Web Service
Imagine we want to write a web service that is called each time a container appears on the junction of the conveyor.

![Conveyor Split]({{ site.url }}/images/shoesorter.gif)

This web service is going to define one endpoint, which will be hit each time a container is scanned before the junction. The endpoint should return an id of the target conveyor. The container will be then pushed onto target conveyor by the hardware.

`GET /junctions/<junctionId>/decisionForContainer/<containerId>` returns

{% highlight json %}
{
  "targetConveyor": "<conveyorId>"
}
{% endhighlight %}

Initial setup (what we already have):
- the `Container` storage that can be queried,
- the `Junction` storage that can be queried,
- the `whereShouldContainerGo` function which returns the decision for a `Container` on the passed as one of the parameters (aka *business logic*) - the call to this function takes 5-10 ms.

We need to implement an HTTP Service which uses the business logic function. We will not focus on the functionality, but the performance and scalability. The only functional requirement is that for each junction, the decisions should be made sequentially in the order of scanned containers.

## We will use Akka
We will use plain Akka, no additional extensions, especially no clustering (yet). Just simple app running on one JVM. I want to show that even without thinking about scalability, it is still reasonably easy to add it later. We will be able to do this just because of the right choice now.

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
  case class Go(targetConveyor: String)

  object Go {
    implicit val goJson = jsonFormat1(Go.apply)
  }
}
{% endhighlight %}

Our service won't receive any JSON data, it will just return JSON object: `Go(targetConveyor)`. It will be automatically marshaled into JSON thanks to the implicit default conversion defined in its companion object.

## Step 2: Creating REST Interface layer
Now it's time to code something real. To implement the HTTP service we will use `spray-http` with `spray-json`. The service will only define one endpoint and based on the passed parameters, it will call our business logic function and return the result wrapped in `Go` object.

{% highlight scala %}
class RestInterface(exposedPort: Int) extends Actor with HttpServiceBase {
  implicit val system = context.system
  implicit val timeout = Timeout(5 seconds)

  val route: Route =
    path("junctions" / IntNumber / "decisionForContainer" / IntNumber) { (junctionId, containerId) =>
      get {
        complete {
          val junction = Junction(junctionId)
          val container = Container(containerId)
          val decision = Decisions.whereShouldContainerGo(junction, container)
          Go(decision)
        }
      }
    }

  def receive = runRoute(route)

  IO(Http) ! Http.Bind(self, interface = "0.0.0.0", port = exposedPort)
}
{% endhighlight %}

I defined an actor which will be handling HTTP Requests. Inside this actor I created a `route` which is constructed from nested `Directives`.

- `path` directive applies the given `PathMatcher` to the HTTP request path and after successful matching, passes the request to its nested route. Additionally, I extract two values from the path, `junctionId` and `containerId`.
- `get` directive makes sure only `HTTP GET` method requests are passed into its nested route.
- `complete` directive accepts a marshallable object and returns it as HTTP response. In this case I don't use any blocking operations and return `Future[Go]` as my object. The real response will be returned when this `Future` completes.

Right now we have almost everything we need to do our first test run. The only missing bit is the entry point for the application.

{% highlight scala %}
object SingleNodeApp extends App {
  implicit val system = ActorSystem("shoesorter")
  system.actorOf(RestInterface.props(8080))
}
{% endhighlight %}

Let's run this application and see how it works.

{% highlight bash %}
± % http localhost:8080/junctions/2/decisionForContainer/3
HTTP/1.1 200 OK
Content-Length: 36
Content-Type: application/json; charset=UTF-8
Date: Sat, 10 Oct 2015 23:18:12 GMT
Server: spray-can/1.3.3

{
    "targetConveyor": "CVR_2_9288"
}
{% endhighlight %}

We see that after scanning container #3 on junction #2, our service made a decision to push the container onto conveyor `CVR_2_9288`.

## Step 3: Performance testing
Let's simulate 10000 calls of our web service, checking the decision for 5 junctions. We will use [ab (ApacheBench)](http://httpd.apache.org/docs/2.2/programs/ab.html) and [parallel (GNU Parallel)](http://www.gnu.org/software/parallel/). For each junction we will simulate a sequence of calls (using `ab`). The parallelisation will kick in on the web service level. We will use `parallel` in order to make parallel calls for 5 different junctions.

### Note about performance testing on a laptop
Remember that numbers presented in this section may (and will) differ depending on a machine, OS, running apps, network, etc. But for the purpose of this post, they are sufficient.

### Note about constraining Akka
In order for all of our tests to be meaningful we will need to constraint Akka. I will be using a 4-core processor. For each running Actor System, we will constraint the parallelism of its default `MessageDispatcher` to 2. This will allow us to simulate a service which struggles for resources.

{% highlight json %}
actor {
  provider = "akka.cluster.ClusterActorRefProvider"

  # capping default-dispatcher for demonstration purposes
  default-dispatcher {
    fork-join-executor {
      # Max number of threads to cap factor-based parallelism number to
      parallelism-max = 2
    }
  }
}
{% endhighlight %}

### Testing our first implementation
Now it's time to test what we currently have.

`URLs.txt`:
{% highlight bash %}
http://127.0.0.1:8080/junctions/1/decisionForContainer/1
http://127.0.0.1:8080/junctions/2/decisionForContainer/4
http://127.0.0.1:8080/junctions/3/decisionForContainer/5
http://127.0.0.1:8080/junctions/4/decisionForContainer/2
http://127.0.0.1:8080/junctions/5/decisionForContainer/7
{% endhighlight %}

{% highlight bash %}
± % cat URLs.txt | parallel -j 5 'ab -ql -n 2000 -c 1 -k {}' | grep 'Requests per second'
Requests per second:    44.78 [#/sec] (mean)
Requests per second:    44.22 [#/sec] (mean)
Requests per second:    43.77 [#/sec] (mean)
Requests per second:    43.82 [#/sec] (mean)
Requests per second:    43.98 [#/sec] (mean)
{% endhighlight %}

We defined our 5 URLs (one for each junction) to be called in parallel, and each of them:
- 2000 times (`-n 2000`),
- at most 1 at one time (`-c 1`),
- and using keep-alive (`-k`).

We are only interested in `Requests per second`. As you see, the throughput of our service is around 44 requests per second. Let's put it into perspective by introducing

## Step 4: One actor per junction
We just have one actor (= one thread) that sequentially makes a decision for all junctions. We know we can do better by trying to process junctions in parallel (they are independent).

Firstly let's add a new message to our `Messages`.

{% highlight scala %}
object Messages {
  case class WhereShouldIGo(junction: Junction, container: Container)
  // ...
}
{% endhighlight %}

The message `WhereShouldIGo` will be send to the actor responsible for making a decision.

The decider actor will be very simple. It should be able to receive message `WhereShouldIGo` and reply with `Go` based on the logic that we have in the `whereShouldContainerGo` function.

{% highlight scala %}
class SortingDecider extends Actor with ActorLogging {
  def receive: Receive = {
    case WhereShouldIGo(junction, container) => {
      val targetConveyor = Decisions.whereShouldContainerGo(junction, container)

      sender ! Go(targetConveyor)
    }
  }
}
{% endhighlight %}

Now we need to modify our `RestInterface` to take one `decider` actor as dependency and use it whenever a decision needs to be made.

{% highlight scala %}
class RestInterface(decider: ActorRef, exposedPort: Int) extends Actor with ActorLogging with HttpServiceBase {
  // ...
  val route: Route =
    path("junctions" / IntNumber / "decisionForContainer" / IntNumber) { (junctionId, containerId) =>
      get {
        complete {
          decider.ask(
            WhereShouldIGo(Junction(junctionId), Container(containerId))
          ).mapTo[Go]
        }
      }
    }
  // ...
}
{% endhighlight %}

Let's pass this actor to our `RestInterface` during construction phase.

{% highlight scala %}
object SingleNodeApp extends App {
  implicit val system = ActorSystem("shoesorter")

  val oneDecider = system.actorOf(SortingDecider.props)
  system.actorOf(RestInterface.props(oneDecider, config getInt "application.exposed-port"))
}
{% endhighlight %}

What have we gained by introducing the actor to just wrap a function call? Nothing yet.

{% highlight bash %}
± % cat URLs.txt | parallel -j 5 'ab -ql -n 2000 -c 1 -k {}' | grep 'Requests per second'
Requests per second:    34.49 [#/sec] (mean)
Requests per second:    34.49 [#/sec] (mean)
Requests per second:    34.49 [#/sec] (mean)
Requests per second:    34.50 [#/sec] (mean)
Requests per second:    34.52 [#/sec] (mean)
{% endhighlight %}

It made things even worse. Our code is still sequential, but we added another layer of abstraction. But we are not done yet. We need to create another layer: an actor that will create `SortingDeciders` per junction and proxy `WhereShouldIGo` to the right ones. This way our system will make decisions concurrently.

{% highlight scala %}
class DecidersGuardian extends Actor {
  implicit val timeout = Timeout(5 seconds)

  def receive = {
    case msg @ WhereShouldIGo(junction, _) =>
      val sortingDecider = getOrCreateChild("J" + junction.id,
                                            SortingDecider.props)
      val futureAnswer = (sortingDecider ? msg).mapTo[Go]
      futureAnswer.pipeTo(sender())
  }

  def getChild(name: String): Option[ActorRef] = context.child(name)

  def getOrCreateChild(name: String, props: Props): ActorRef = {
    getChild(name) getOrElse context.actorOf(props, name)
  }
}
{% endhighlight %}

Let's add our new actor as dependency for `RestInterface`:
{% highlight scala %}
object SingleNodeApp extends App {
  implicit val system = ActorSystem("shoesorter")

  val deciders = system.actorOf(DecidersGuardian.props)
  system.actorOf(RestInterface.props(deciders, config getInt "application.exposed-port"))
}
{% endhighlight %}

Right now, when our `RestInterface` gets 2 messages for different junctions, it will forward them to two different actors and they will be able to make decision in parallel. Therefore, we should get a substantial improvement:

{% highlight bash %}
± % cat URLs.txt | parallel -j 5 'ab -ql -n 2000 -c 1 -k {}' | grep 'Requests per second'
Requests per second:    67.36 [#/sec] (mean)
Requests per second:    69.03 [#/sec] (mean)
Requests per second:    67.75 [#/sec] (mean)
Requests per second:    66.88 [#/sec] (mean)
Requests per second:    66.28 [#/sec] (mean)
{% endhighlight %}

## Step 5: Scalability testing
Until now, we have been concerned only about the performance of our service. Performance is how fast something can be done in terms of time. `Requests per second` metric that we have been using so far is a good example. So what's the difference between performance and scalability?

Scalability of a system is how adding more resources affects its performance. E.g. doubling the throughput by doubling the resources is linear scalability.

## Problems with single-noded applications
Our application supports several junctions and processing of each of them is done concurrently. We can scale up by adding more CPU power (cores). What about scaling out?

## Step 6: Making our web service scalable
Classical approach to scaling out in JVM world is by adding instances and making them connect to each other. In our case this would look like that:



### Sharded - one node:
{% highlight bash %}
± % cat URLs.txt | parallel -j 5 'ab -ql -n 2000 -c 1 -k {}' | grep 'Requests per second'
Requests per second:    68.39 [#/sec] (mean)
Requests per second:    66.30 [#/sec] (mean)
Requests per second:    65.99 [#/sec] (mean)
Requests per second:    64.86 [#/sec] (mean)
Requests per second:    64.54 [#/sec] (mean)
{% endhighlight %}

### Sharded - two nodes:
{% highlight bash %}
± % cat URLs.txt | parallel -j 5 'ab -ql -n 2000 -c 1 -k {}' | grep 'Requests per second'
Requests per second:    106.80 [#/sec] (mean)
Requests per second:    108.15 [#/sec] (mean)
Requests per second:    100.60 [#/sec] (mean)
Requests per second:    99.92 [#/sec] (mean)
Requests per second:    100.07 [#/sec] (mean)
{% endhighlight %}

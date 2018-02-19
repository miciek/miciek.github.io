---
layout: post
title: "Building functional & testable HTTP APIs"
summary: "Learn about two functional techniques that help in separation of concerns: functions as parameters and type parameters."
image: /images/building-functional-testable-http-apis/summary.png
tags: scala beginner functional-programming api architecture akka-http separation-of-concerns pac-man
---

Majority of us intuitively know what *separation of concerns* is. However, knowing something and using it in practice are two different things. Developers in many projects are drowning in *entangled* spaghetti-like codebases. We need better tools that force us to think about the responsibilities more often. In this post I will introduce two simple functional techniques that will help us step up the game: **functions as parameters** and **type parameters**. 

To show you how these tools can help us create separated concerns, let's use a practical example. We are going to create a Pac-Man web server.

## Example: Pac-Man server
For the sake of this post, let's assume that our Pac-Man web server will use HTTP and will provide the following functionalities:

- starting a game based on provided name of the grid,
- moving Pac-Man,
- returning current position and direction of Pac-Man,
- changing Pac-Man's direction.

In order to implement these features we will need a `GameState` object to hold the current state of the game.

```scala
case class GameState(pacMan: PacMan,
                     nextPacManDirection: Option[Direction],
                     grid: Grid,
                     dotCells: Set[Position])
                     
case class PacMan(position: Position, direction: Direction)
```

It contains the current state of a `PacMan`, next chosen direction, the grid setup and remaining dot cells, which are cells that still contain a dot (the thing Pac-Man eats). 

The `GameState` instances will be created and manipulated by `GameEngine`.

```scala
object GameEngine {
  def start(gridName: String): Either[String, GameState]

  def movePacMan(gameState: GameState): GameState

  def changePacMansDirection(gameState: GameState,
                             newDirection: Direction): GameState
}
```

`GameEngine` has several functions that expect `GameState` as a parameter and return a new one. Nothing too fancy - very standard immutable approach.

Our objective is to create an HTTP layer that holds current `GameState` and publishes `GameEngine` functions for outside consumers. We will have 3 iterations, each of them will be better in terms of *separation of concerns*.

## Standard approach: direct function calls
Let's start with a standard approach which *entangles* the concerns of HTTP and logic (i.e. `GameEngine`). Please have a look at the following snippet:

```scala
class HttpRoutes extends Directives {
  private var state = Map.empty[Int, GameState]

  val routes: Route =
    path("games") {
      post {
        entity(as[StartGameRequest]) { request =>
          val startedGame = GameEngine.start(request.gridName, Grid.fromName)
          startedGame match {
            case Right(game) =>
              val gameId = state.size
              state = state + (gameId -> game)
              complete(StartGameResponse(gameId))
            case Left(errorMessage) =>
              complete((StatusCodes.NotFound, errorMessage))
          }
        }
      }
    } ~
    path("games" / IntNumber) { gameId =>
      get {
        val maybeGame = state.get(gameId)
        maybeGame match {
          case Some(game) => complete(PacManStateResponse(game.pacMan))
          case _ => complete((StatusCodes.NotFound, s"Pac-Man ($gameId) not found"))
        }
      }
    } ~
    ...
}

final case class StartGameRequest(gridName: String)
final case class PacManStateResponse(pacMan: PacMan)
```

We have defined several `routes` using [Akka HTTP](https://doc.akka.io/docs/akka-http/current/index.html) Route DSL and that looks completely fine. What's not fine is how much the HTTP module knows about other concerns in the application, namely `var state`, `GameEngine` and `GameState`. Let's analyse these problems carefully.

![Standard approach](/images/building-functional-testable-http-apis/before.png)

### Problems with standard approach
Firstly, `HttpRoutes` knows everything about how state is implemented. Should HTTP know anything about state? I don't think so, this concern should be separated.

Secondly, `HttpRoutes` knows almost everything about `GameEngine`. It knows that it exists, it knows about `start` function. It may seem natural, because it's job is to provide additional interface for `GameEngine`. However, I'd argue that this coupling is too tight. `HttpRoutes` doesn't need to know anything about `GameEngine`. It needs to be able to start a game, which is not the same thing.

Finally, the whole thing is totally untestable. HTTP & JSON should have their own unit tests that check whether the API is properly implemented. These particular tests shouldn't test any game logic, which should be tested separately in `GameEngine` unit tests. 

All these issues tend to get worse and worse as projects get bigger.[^tarpit] That's why we need to take serious measures to make it right in the early days, when it's still possible. In this post I will show you how to disentangle the concerns in our simple application using the following tools: **functions as parameters** and **type parameters**.

## Abstracting over state using type parameters
First change I always try to do when I feel one of my modules deals with too many concerns is to abstract over as many concrete types as I can. This simple exercise gives me a lot of insight about the design and makes the rest of the refactoring steps more natural. 

To show you a concrete example, let's get rid of `GameState` and use type parameter `G` instead.

```scala
class HttpRoutes[G] extends Directives {
  private var state = Map.empty[Int, G]
  ...
}
```

Now the compiler will tell us which parts of the code were using `GameState` and we need to investigate each of those problems separately by asking the question: *"Does it really need to know?"*. In our case: *"Does `HttpRoutes` really need to know about `GameState`?"*. Let's find out by trying to deal with compile errors.

After making this change, the only compiler error in our case is this piece of code:
```scala
val maybeGame = state.get(gameId)
maybeGame match {
  case Some(game) => complete(PacManStateResponse(game.pacMan))
  case _ => complete((StatusCodes.NotFound, s"Pac-Man ($gameId) not found"))
}
```

We can see that our HTTP layer needs to `complete` the request with the `PacManStateResponse`, which contains only a `PacMan` instance. This piece of code doesn't need `GameState` at all! It only needs `PacMan` provided it has `G`. We can encode this sentence as a function `G => PacMan` and make sure `HttpRoutes` gets this function from the outside world.
```scala
class HttpRoutes[G](getPacMan: G => PacMan) extends Directives
```

```scala
val maybeGame = state.get(gameId)
maybeGame match {
  case Some(game) => complete(PacManStateResponse(getPacMan(game)))
  case _ => complete((StatusCodes.NotFound, s"Pac-Man ($gameId) not found"))
}
```

### But... why?
Why do we want to do that knowing that `G` will always be a `GameState`?
 
Because it helps us get our design right and helps future developers understand our intentions. It is a straightforward way of telling that this piece of code is independent of `GameState`. It only depends on `PacMan` and needs a way to get it from a `G`. It cannot create an instance of `G` or modify `G`, because it doesn't know what `G` is. The module is **constrained** which makes it far easier to comprehend[^dijkstra]. Additionally, it gives much more **liberty** to the modules that use it, because they can choose whatever `G` they want as long as they also define how to get a `PacMan` from `G`.[^runar]

## Using more functions as parameters
We got rid of the dependency to `GameState` in one place, but we can do even better. Let's think about the responsibility of our `POST /games` (game creation) endpoint. 

This is how the code that handles game creation looks like:
```scala
val startedGame: Either[String, GameState] =
  GameEngine.start(request.gridName, Grid.fromName)
    
startedGame match {
  case Right(game) =>
    val gameId = state.size
    state = state + (gameId -> game)
    complete(StartGameResponse(gameId))
  case Left(errorMessage) =>
    complete((StatusCodes.NotFound, errorMessage))
}
```

It gets a `gridName` string as an input and completes the request returning either `gameId` integer or a failure message. It uses `GameEngine.start` directly so it "knows" everything about it. However, when you think about it, this endpoint doesn't really need to know about `GameEngine`! We can use the same technique to figure it out: replace direct call with a more generic function, which is passed as a parameter. Let's see how it works in this case.

What the code that handles game creation needs is:
- a way to get a new instance of `G` (no matter what it is),
- a way to add a `G` to the state and get `gameId` back.

The first statement can be encoded as a function `createGame: String => Either[String, G]`. The second statement can be encoded `addNewGame: G => Int`. Note that there is no `GameState`, no `GameEngine` in this piece of code. Just as much information as this layer really needs, but no more. Truly separated concerns.

Let's pass these functions as parameters (dependencies) in `HttpRoutes`:
```scala
class HttpRoutes[G](getPacMan: G => PacMan,
                    createGame: String => Either[String, G],
                    addNewGame: G => Int) extends Directives {
  private var state = Map.empty[Int, G]

  val routes: Route =
    path("games") {
      post {
        entity(as[StartGameRequest]) { request =>
          val startedGame = createGame(request.gridName)
          startedGame match {
            case Right(game) =>
              val gameId = addNewGame(game)
              complete(StartGameResponse(gameId))
            case Left(errorMessage) =>
              complete((StatusCodes.NotFound, errorMessage))
          }
        }
      }
    } ~
    ...
}
```

## Removing state
These two simple refactorings gave us another insight. We don't need `var state: Map.empty[Int, G]` anymore! We just need a way to get a `G` based on `Int`. Speaking in Scala, the previous sentence can be translated as a function `getGame: Int => G`. Again, we are separating a concern of *HTTP handling* and *state management* by giving the HTTP layer as little power as it needs. We are constraining it as much as we can so that we can reason about it easier.

## Final touch: splitting routes to route factories
The parameter list for `HttpRoutes` class got very big. It means that it does too much. The same can be said about `val routes`. Let's solve both issues by breaking `routes` into smaller functions which get their dependencies as parameters and return partial `Route`s.

```scala
object HttpRoutes extends Directives {
  def createGameRoute[G](createGame: String => Either[String, G],
                         addNewGame: G => Int): Route =
    path("games") {
      post {
        entity(as[StartGameRequest]) { request =>
          val startedGame = createGame(request.gridName)
          startedGame match {
            case Right(game) =>
              val gameId = addNewGame(game)
              complete(StartGameResponse(gameId))
            case Left(errorMessage) =>
              complete((StatusCodes.NotFound, errorMessage))
          }
        }
      }
    }

  def getGameRoute[G](getGame: Int => Option[G],
                      getPacMan: G => PacMan): Route =
    path("games" / IntNumber) { gameId =>
      get {
        val maybeGame = getGame(gameId)
        maybeGame match {
          case Some(game) => complete(PacManStateResponse(getPacMan(game)))
          case _ => complete((StatusCodes.NotFound, s"Pac-Man ($gameId) not found"))
        }
      }
    }
  ...
}
```

## Connecting the dots
So far, so good. We got rid of `GameState` and `GameEngine` dependencies by replacing them with `G` and function parameters in `HttpRoutes`. However, our application still needs both of them to be useful. We need to pass the right arguments when creating the HTTP routes. Additionally, the application needs to know how to handle the state and since it is a different concern it will be handled by `MultipleGamesAtomicState`[^atomicState].

```scala
object App extends HttpApp {
  private val atomicState: MultipleGamesAtomicState = ??? // see footnotes

  val route: Route =
    createGameRoute(GameEngine.start(_, Grid.fromName), atomicState.addNewGame) ~
    getGameRoute[GameState](atomicState.getGame, _.pacMan) ~
    ...
}
```

And that's all we need! The above piece of code has responsibility of composing all our other concerns into a usable application.

![Connecting the refactored concerns](/images/building-functional-testable-http-apis/after.png)

## And better testability for free!
There is another quick win we've got after doing the aforementioned refactorings. We can test our HTTP layer in total isolation! That means we can have *unit tests* for our endpoints without worrying about state or game logic. For example let's see the test for `getGameRoute` function:

```scala
trait TestScope {
    final case class FakeGame(id: Int, pacMan: PacMan)
    def getPacMan(game: FakeGame): PacMan = game.pacMan
}

"allow getting Pac-Man's state in existing game" in new TestScope {
  val getGameRoute = 
    HttpRoutes.getGameRoute(_ => Some(FakeGame(1, PacMan(Position(2, 1), East))),
                            getPacMan)

  Get("/games/1") ~> getGameRoute ~> check {
    contentType shouldEqual `application/json`
    val expected =
      s"""
         |{
         |  "pacMan": {
         |    "position": { "x": 2, "y": 1 },
         |    "direction": "east"
         |  }
         |}
      """.stripMargin

    responseAs[String] should beJson(expected)
  }
}

"not allow getting the Pac-Man state when there are no games" in new TestScope {
  val getGameRoute = HttpRoutes.getGameRoute(_ => None, getPacMan)

  Get("/games/2") ~> getGameRoute ~> check {
    status shouldEqual StatusCodes.NotFound
  }
}
```

Again, this only contains the tests of HTTP layer, focusing purely on JSON input & output. We use a functional version of dependency injection - *functions*. No mocking library needed! Those tests are also very stable and fast, because they are not running any server under the hood.

## Summary
In this post I have shown you how we can separate concerns of a simple web application. We have separated:
 - state representation,
 - state management,
 - game logic handling,
 - HTTP handling.
 
We achieved that using two basic tools: **functions as parameters** and **type parameters**. After making the refactorings the modules became more constrained which gave us two additional *powers*: 
- easier reasoning about each of the above aspects separately,
- better testability. 

The code I have shown in this post is available in [pacman-multiplayer-fp repository](https://github.com/miciek/pacman-multiplayer-fp). I also use this example in [my workshops](/workshops) that teach Scala and functional programming to beginners.

## What's next?
Functional programming is about composition and separation of concerns. We can use pure functions to solve many issues in our architecture. But what if logic gets more advanced? What if the state is fetched asynchronously or HTTP responses are more complex? We need more advanced tools, which will be introduced in one of the next posts.

---
[^tarpit]: *"Complexity is the single major difficulty in the successful development of large-scale software systems."* ["Out of the Tarpit"](http://curtclifton.net/papers/MoseleyMarks06a.pdf) - Ben Moseley, Peter Marks
[^dijkstra]: *"Intelligent thinking is that one is willing to study in depth an aspect of one's subject matter in isolation for the sake of its own consistency"* ["On the role of scientific thought"](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD04xx/EWD447.html) - Edsger Dijkstra
[^runar]: ["Constraints Liberate, Liberties Constrain"](https://www.youtube.com/watch?v=GqmsQeSzMdw) - Runar Bjarnason
[^atomicState]: The state is handled by [Monix Atomic](https://monix.io/docs/2x/execution/atomic.html). I will cover this in one of the next posts.

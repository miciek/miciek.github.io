---
layout: post
title: Reactive UI by example
date: 2016-04-10 18:00
summary:
tags: javascript tutorial reactive functional bacon react.js how-to streams
---

Wanna learn how to write functional and reactive frontend applications? It's 2016 and things have changed a lot since GWT, jQuery and even Angular... That's why I came up with an idea of writing a simple web game using only the "current best practices". The code of this sample application can be found on my [github repo](https://github.com/miciek/web-snake-react-bacon). But before I start implementing the game, I want to write about 3 "whys".

##Why JavaScript?
Frontend technologies can be really overwhelming. All things change very quickly. If you don't want to be dependent on these changes, you need to use one thing that has survived: JavaScript. And it's not a bad thing nowadays. ES6, the newest version of JavaScript, is very cool. It's still not fully supported, and until it isn't we can use some transpilers to the current JavaScript version (ES5). In our case, we will write in ES6 and use Babel to transpile it to ES5 automatically.

##Why React?
In React we develop independent components that can be composed and form bigger components. Components are immutable-friendly. We don't need any "vars"/"lets" in our code. Our immutable data is created and then flows in one direction (down the component hierarchy). You may want to compare components and plain functions. Just like each function has input and output, each React component takes "state" object and "props" object and then produces "HTML". And when "called" with the same "state" and "props", it will always produce the same "HTML".

To sum up, React supports declarative approach to writing user interface. And if you have ever written user interface imperatively, you will see a big difference.

But that's not all! React applications performance is very good without even thinking about it. Your components don't really produce HTML, but JavaScript objects. Those objects form a hierarchy that is called the virtual DOM. Virtual DOM is processed by React engine and only changed things are propagated to the real browser DOM. That's why our component can be called many times in a row without affecting the performance. If it produces the same virtual DOM objects, nothing will happen in the browser. Hail to the declarative programming!

And one last thing. React is simple. It does one thing and does it well. It isn't even a MVC framework. It's just a V framework. It only does View. You can use whatever you want for model and whatever you want to control the flow of the data. And if we can choose, we always choose streams!

##Why Streams?
When developing web applications, we need to deal with many different events flying around. User pressed something, new data came from the outside, timer went off and so on. Classic approach to this "event spaghetti" is to use callbacks. We don't like callbacks because they tend to form "callback hells". Nobody likes any kind of hell.

In order to achieve this, we need to stop focusing on individual events and start thinking about streams of events. When the smallest notion we have is a stream, we can declaratively define what happens when something appears in this stream. We can transform our streams using map & filter functions. We can combine our data using merge & combine functions.

##Enough! Enter Snake!
Let's create a web Snake game. This won't take long I promise. About 100 lines of code and we are done! If you want to follow the steps that I am describing here, please checkout the [the empty snake project](https://github.com/miciek/web-snake-react-bacon/tree/workshop-init) and develop the game as you are reading!

### Vector
In order to do anything productive, we need to create a Vector class which will hold our 2D positions and sizes.

{% highlight js %}
// Vector.js

export default class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  equals(p) {
    return this.x === p.x && this.y === p.y
  }

  add(p) {
    return new Vector(this.x + p.x, this.y + p.y)
  }

  static random(size) {
    return new Vector(
      Math.floor(Math.random() * size.x),
      Math.floor(Math.random() * size.y)
    )
  }

  static rotateRight(pos) {
    return new Vector(-pos.y, pos.x)
  }

  static rotateLeft(pos) {
    return new Vector(pos.y, -pos.x)
  }
}
{% endhighlight %}

### Static board
Now we will create our first *React* component, which will be called... `Board`!

{% highlight js %}
// Board.jsx

export default class Board extends React.Component {
  render() {
    return <h1>this is board {this.props.size.x} x {this.props.size.y}</h1>
  }
}
{% endhighlight %}

and main.jsx which will bootstrap our app:

{% highlight js %}
// main.jsx

React.render(<Board size={new Vector(20, 20)} />, document.getElementById("app"))
{% endhighlight %}

Let's run `npm start` and see that right now the browser displays

{% highlight html %}
This is board 20 x 20
{% endhighlight %}

Not the coolest thing, but let's see what's happening inside. `main.jsx` is an entry point to the application. It defines the root React component that will contain all other components and will be rendered inside our empty element called "app" which is defined inside `index.html` file. The `Board` component gets one property called `size` which is a Vector(20, 20). That means that our board will have 20 rows and 20 columns.

To render the Board, React engine calls `render` function. It has access to the properties that are passed to the component from the "outside world". For now, it just renders them inside `h1` object (which is then rendered in the browser as `h1` HTML tag).

Let's make our board fancier. We will use Flexbox to generate a grid and each cell will have one of three colors: grey if empty, green if snake and red if fruit. These are our styles:

{% highlight css %}
/* style.css */

.board {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.cell {
  width: 35px;
  height: 35px;
  background-color: #eeeeee;
}

.snake {
  background-color: #807920;
}

.fruit {
  background-color: #ff5605;
}
{% endhighlight %}

As you see, thanks to Flexbox we are able to just define some divs and the rest will be taken care of by the browser. Let's see how!

{% highlight js %}
// Board.jsx

export default class Board extends Component {
  static propTypes = {
    size: PropTypes.instanceOf(Vector).isRequired,
    snakePositions: PropTypes.arrayOf(Vector).isRequired,
    fruitPosition: PropTypes.instanceOf(Vector).isRequired
  }

  render() {
    const { size, snakePositions, fruitPosition } = this.props
    const rows = _.range(size.y).map(y => {
      const cells = _.range(size.x).map(x => {
        const pos = new Vector(x, y)
        const maybeSnakeStyle = { [style.snake]: snakePositions.find(x => x.equals(pos)) }
        const maybeFruitStyle = { [style.fruit]: fruitPosition.equals(pos) }
        return <div key={x} className={ classNames(style.cell, maybeSnakeStyle, maybeFruitStyle) }/>
      })
      return <div key={y} className={style.row}>{cells}</div>
    })

    return <div className={style.board}>{rows}</div>
  }
}
{% endhighlight %}

There are just 2 things going on here. The first one is called `propTypes`. The properties that are passed to our component (like `size`) can be "type-checked" by React. Here, we are saying that `size` is a `Vector`, `snakePositions` is an array of `Vectors`, and fruitPosition is another `Vector`. All of them are required. If doesn't pass any of them or passes an object with a wrong type, React will show us a warning (only in dev mode). This feature is just for our convenience.

In the new `render` function we just generate a `div` hierarchy and use `classnames` lib to use a proper style for each cell.

### Resources
 - [Empty Snake GitHub project with all boilerplate in place](https://github.com/miciek/web-snake-react-bacon/tree/workshop-init) - just checkout and start coding. Together with this post you should be able to create a simple Snake game,
 - [The current working version of the code](https://github.com/miciek/web-snake-react-bacon/) - if you just want to review the code I created, checkout this repository and run it with `npm start`.

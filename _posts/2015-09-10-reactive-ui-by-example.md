---
layout: post
title: Reactive UI by example
date: 2015-09-10 00:00
summary:
tags: javascript tutorial reactive functional bacon react.js how-to
---

Wanna learn how to write functional and reactive frontend applications? It's 2015 and things have changed a lot since GWT, jQuery and even Angular... That's why I came up with an idea of writing a simple web game using only the "current best practices". The code of this sample application can be found on my [github repo](). But before I start implementing the game, I want to write about 3 "whys".

##Why JavaScript?
Frontend technologies can be really overwhelming sometimes. All things change very quickly. If you don't want to be dependent on these changes, you need to use one thing that has survived: JavaScript. And it's not a bad thing nowadays. ES6, the newest version of JavaScript, is very cool. It's still not fully supported, and until it isn't we can use some transpilers to the current JavaScript version (ES5). In our case, we will write in ES6 and use Babel to transpile it to ES5 automatically.

##Why React?
In React we develop independent components that can be composed and form bigger components. Components are immutable-friendly. We don't need any "vars"/"lets" in our code. Our immutable data is created and then flows in one direction (down the component hierarchy). You may want to compare components and plain functions. Just like each function has input and output, each React component takes "state" object and "props" object and then produces "HTML". And when "called" with the same "state" and "props", it will always produce the same "HTML".

To sum up, React supports declarative approach to writing user interface. And if you have ever written user interface imperatively, you will see a big difference.

But that's not all! React applications performance is very good without even thinking about it. Your components don't really produce HTML, but JavaScript objects. Those objects form a hierarchy that is called virtual DOM. This virtal DOM is processed by React engine and only changed things are propagated to the real browser DOM. That's why our component can be called many times in row without affecting the performance. If it produces the same virtual DOM objects, nothing will happen in the browser. Hail to the declarative programming!

And one last thing. React is simple. It does one thing and does it well. It isn't even a MVC framework. It's just a V framework. It only does View. You can use whatever you want for model and whatever you want to control the flow of the data. And if we can choose, we always choose streams!

##Why Bacon?
When developing web applications, we need to deal with many different events flying around. User pressed something, new data came from the outside, timer went off and so on. Classic approach to this "event spaghetti" is to use callbacks. We don't like callbacks because they tend to form "callback hells". Nobody likes any kind of hell.

In order to achieve this, we need to stop focusing on individual events and start thinking about streams of events. When the smallest notion we have is a stream, we can declaratively define what happens when something appears in this stream. We can transform our streams using map & filter functions. We can combine our data using merge & combine functions.

##Enough! Enter Snake!
Let's create a web Snake game. This won't take long I promise. About 100 lines of code and we are done! 

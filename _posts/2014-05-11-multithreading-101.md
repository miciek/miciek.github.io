---
layout: post
title: Multithreading 101
date: 2014-05-11 00:06:00
summary: This post will explain the basics laying behind multithreading in general and how those basics relate to real-world programming languages (Java in this case). This is the foundation which we will build upon in later posts, where we will talk about advanced multithreading and concurrency topics.
tags: multithreading beginner java
---

This post will explain the basics laying behind multithreading in general and how those basics relate to real-world programming languages (Java in this case). This is the foundation which we will build upon in later posts, where we will talk about advanced multithreading and concurrency topics.

###Crash course first

Programs are basically **processes** managed by the operating systems, which are run on top of a hardware. One process can have one or more **threads**. In JVM world, the virutal machine is also present and acts between the threads and OS.

All of the above entities are used in multithreading, but each layer abstracts details to make next one's life easier). Or harder.

I will mainly focus on the thread layer, but some considerations about lower layers will also be presented. Stay tuned.

####Thread

But what is a thread? Thread is were the code is run. The memory between the threads is shared, which is both bad and good (more on that later). To get the best performance, one thread should be run by one processor's core (or logical core). If there are more threads than cores, OS perform a **thread switching** or **context switching** if it relates to processes. This means that currently running thread is going back to the pool and some other thread is chosen to be running. The rules behind switching and choosing the thread are not very strict, can change a lot and, therefore, should not be trusted. As a developer, you should always assume that everything can happen when it comes to multithreading. This way you are safe.

The pool mentioned in the last paragraph is connected with the state of a thread. Each thread can be either **new**, **runnable**, **blocked**, **waiting** or **terminated**. In the beginning this is a one-way road, meaning that once the thread is done being new (i.e. it wants to execute code), it becomes runnable and can't go back. When a thread is in runnable state, it can be either running or ready to be run. The thread is switching between all those states until it is finished and becomes terminated. Once it happens, it cannot go back. I will write about blocked and waiting state later in this post.

The thread consists of **program counter**, **registers**, **call stack** and **thread-local storage**.

####Memory I/O
When CPU wants to read or write to the memory, it specifies the memory address and sends the request through several layers of **cache** (L1, L2, L3 and even more), main memory, HDD, external storage and network (the last three can be in the virtual address space). It's worth noticing, that the deeper it goes, the higher the storage space and latency, sometimes even by several orders of magnitude. The conclusion is that we want to have most of the data in CPU cache (L1 FTW!) and we want to minimalize (or eliminate) direct fetches from the main memory.

There are many different approaches that help to provide the data before it is really needed by the thread, but none of them are in the scope of this blog post.

The important thing is that even if we want to fetch only 4 bytes from the memory, the processor will fetch it with some additional data around it. That is called a **cache line**. So imagine that one thread (we'll call it T1) reads data from cache line that holds data D1 and data D2. T1 needs only D1, but the whole cache line is fetched from the main memory (takes ~100 ns) and put in L1, L2 and L3 cache. After that, thread T2 requests data D2 and finds it in the L1 cache, which takes only around 1 ns. Nice! Now imagine thread T1 wants to save new data in D1. It needs to be saved in the main memory, but also all caches need to "listen for" changes and act upon them. They can do that by snooping, meaning that they invalidate the cache line that holds updated data, or by snarfing, which tries to update the cache line. The thread T1 doesn't wait until the data is saved in the main memory and continues its execution (data is saved asynchronously). Wait, but what happens when T1 and T2 want to save data concurrently? Which data will be saved in each cache and main memory? Does the processor has a solution for that as well? Nope. Basically, as it is mostly asynchronous and each cache works fairly independently, the last one to save wins. But let's not talk about problems yet.

One of the other important things that are used to enhance performance is **out of order execution**. When processor is idle waiting for the data, it can go to the next instructions and execute them. When the data is ready, the results of the next instructions are immediately there and the execution time is far smaller. Of course there are some caveats, but you get the idea.

###Can anything bad happen?
Short answer: yes. Longer answer is called a **race condition**. When output is dependent on the execution sequence of operations or other events, we have a race condition. It may become a bug, when the specific order was not meant by the programmer.

So the T1/T2 concurrent memory/cache write above is one of the examples of race condition. Threads also cache local variables and compilers do additional optimizations assuming that all the variables are not used by other threads. Those things must be addressed by a programmer. One of the possibilities is using a **volatile** keyword on a variable in Java (5 or above), which does two things:

- every thread accessing a volatile variable will read its current value before continuing,
- volatile loads and stores establish a happens-before relationship, meaning that no write can occur during the read and no read can occur during a write.

Out of order execution can also introduce race conditions, but it is solved by **memory barriers**. For example, in x86/x64 architecture there is something called a *full fence*. All loads & stores before the fence need to be done before executing operation after the fence. There are also other, more sophisticated solutions. This is done on lower level and we won't talk about it anymore.

###Where can bad things happen?
Up until now we covered some terminology and introduced a problem in many shapes. The problem called a race condition can only appear in certain situations. For example, it won't be present if we have only one thread in our program, because all things are done sequentially during each execution. It also won't be present in multithreaded environment, when threads don't share any resources (memory or device). It only happens when a piece of code accessing (reading or writing) a shared resource can be executed by more than one thread. This piece of code is called a **critical section**.

###What can we do?
We need to protect our critical sections somehow. Basically a synchronization mechanism is required. One of possible solutions is **mutual exclusion**, which was defined in 1965 by Dijkstra. It is defined as set of software and hardware solutions to prevent race conditions.

####Locks
**Lock** (sometimes called a **mutex lock** or just *mutex*) is a simple synchronization primitive, which is declaratively associated with a critical section and can only be *owned* by one thread at a time. Only the thread that owns the lock can enter the critical section. If more than one thread tries to enter a critical section, only one of them would acquire the lock associated with the section. The other ones would be in a *blocked* state until the lock is released. Then they become *runnable* again. The lock is released by the owning thread at the exit of critical section.

Are those the locks that Java use? No. Wait for it.

####On the side: Mutual exclusion side effects

Before we continue with other synchronization primitives, it is worth mentioning that each of mutual exclusion solutions has side effects, namely:

- **deadlocks** - when we have two threads T1 (which owns lock L1) and T2 (which owns lock L2) and two critical sections guarded by locks L1 and L2, and T1 wants to acquire L2 while T2 wants to acquire L1; the threads will wait infinitely;
- **starvation** - when several threads want an access to a critical section and one of them holds onto a lock majority of time, the other threads may never finish their computation and therefore *starve*,
- **priority inversion** - when a thread with lower priority owns a lock, which is also needed by a higher-priority thread.

####Reentrant locks
Another way that a thread can cause a deadlock is by recursively trying to acquire the lock that is already owned by it. That's why **reentrant locks** were introduced. If a thread holds a lock, it can recursively acquire it again. The only thing to remember is that it also needs to release it the same number of times.

Are those the locks that Java use? Yes. Java has [ReentrantLock](http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/locks/ReentrantLock.html) class, which implements this behavior, but also reentrant lock is a foundation, which Java's synchronization model is built on (the `synchronized` keyword in cooperation with any `Object`).

####Monitors
But Java has something more up its sleeve. It provides a built-in support for **monitors**! This is a synchronization mechanism which consists of a lock and a **condition variable** which gives a thread the ability to temporarily give up the lock and wait for a certain condition to become true (the thread goes to *waiting* state). It is basically a queue of threads that at least once in the past had the monitor's lock. Those threads wait until a notification is sent to them by the condition variable mechanism. This notification (or signal) means that condition is true and they can reacquire the lock and continue their execution.

In Java all `Object` instances are monitors. They have 3 methods that implements mechanism described above:

- `Object.wait()` method - wait for a condition in this monitor,
- `Object.notify()` method - notify one waiting thread that condition associated with me has just became true,
- `Object.notifyAll()` method - notify all waiting threads that condition associated with me has just became true.

####Other mutual exclusion mechanisms
Many languages has implemented many types of mutual exclusion mechanism. We will look into them in one of the next blog posts.

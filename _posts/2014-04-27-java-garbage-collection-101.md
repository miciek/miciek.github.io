---
layout: post
title: Java Garbage Collection 101
date: 2014-04-27 14:24:23
summary: Do you have an interview tomorrow and want to refresh your knowledge on garbage collection? Or maybe you are new to this topic and just want to start somewhere? Either way, this is a place for you. In this post, I will go from fundamentals to the practical implementations and will introduce you to several GC buzzwords.
categories: java
---

Do you have an interview tomorrow and want to refresh your knowledge on garbage collection? Or maybe you are new to this topic and just want to start somewhere? Either way, this is a place for you. In this post, I will go from fundamentals to the practical implementations and will introduce you to several GC buzzwords. I will also provide some links to other helpful blog posts, articles and videos. Please use them if you feel I am being too liberal.

##Theory
First things first. Garbage collection (GC) is the process which aims to reclaim memory used by objects that are no longer referenced from any reachable objects. There are only two basic types of garbage collectors: **tracing** and **reference counting**. Interesting fact: both of them were introduced in 1960s.

Tracing algorithm starts with an empty set and adds live objects to it. Then it analyzes all outgoing references of those live objects and discovers more live objects. It terminates when all references are analyzed and all live objects are in the set. Then it reclaims the remaining memory.

Reference counting is somewhat more subtle. It cannot work on its own and it needs some additional data to be provided before the collection. This data is generated between collections during normal program execution. Each object has a reference counter. All allocations and new references to an object cause incrementation of the counter. Each removed reference adds a given object to the pool of potential candidates for garbage collection. When collection algorithm walks in, it takes the list of potential candidates and decrements a counter for each of them. When decrementation causes the counter to become 0, the memory held by the object is reclaimed.

So which of them is more popular, you ask? Well, both of them actually. Commercial collectors are tracing collectors with some elements taken from reference counting. This should be more obvious by the end of the post. If you want to get into more details please watch [this YouTube video](https://www.youtube.com/watch?v=XtUtfARSIv8) and read [this academic paper](http://www.cs.virginia.edu/~cs415/reading/bacon-garbage.pdf).

##Terminology
Before we take off, we need to have some fundamental GC terminology taken care of. **Mutator** is your program. It mutates the state of the **heap**, which is the thing that holds **live** objects, **dead** objects and empty memory. Live objects are objects that currently can be reached within your program. Dead objects are objects that could be reached in the past and memory they use now needs to be reclaimed. This is the work for the **collector**. If it can work only when all threads are stopped, we call it a **stop-the-world collector**. The period when the collector does its work is called the **pause**. There are also **concurrent collectors**. They do their work concurrently with mutators. Do not confuse them with **parallel collectors**, which are collectors that have multiple threads. Collectors do their work in **passes**. If all of the work is done during one pass, the collector is **monolithic**. If one piece of work is split into many passes, we are dealing with **incremental** collector.

##Algorithms
Still with me? It's time to introduce GC **algorithms**! Basically each algorithm does 3 steps:

1. identify live objects in the heap,
1. reclaim resources used by dead objects,
1. relocate live objects to create *contiguous memory chunks*.

Those steps can be mixed and matched depending on the algorithm. The first two should be self-explanatory. The third one is strictly connected to the **memory fragmentation** problem. If GC didn't have this step, objects would be scattered around the heap creating many small "holes". At some point the allocator wouldn't be able to allocate a new object even though there is sufficient space in the heap (the sum of all the "holes"). That's why objects need to be moved around the heap to create contiguous memory spaces.

Ever heard of **mark & sweep**? Or **mark/sweep/compact**? This is the most popular phrasing when it comes to GC algorithms. Each step of this algorithm corresponds to the generic step in the list above. But each of those steps can be treated as different algorithms which use each others' outputs. Let's go through them.

###Mark
The marking algorithm identifies all live objects in the heap. Each object has a flag which says if it's alive or dead. Setting flag to 1 is called **marking** (or, historically, tracing). The algorithm goes like this:

- All flags are set to 0 (dead).
- Search through the **roots** (thread stacks, globals, etc.) and add all the found objects to the **live set** (i.e. mark them as "alive").
- Use some sort of graph-search algorithm where objects are vertices and outgoing references are directed edges. Add all the found objects to the live set.

The complexity of this algorithm is linear to the size of the live set. We need to visit all live objects and all references from those objects and nothing more.

###Sweep
The sweeping algorithm uses marking algorithm output as an input. Its main concern is to "remove" dead objects or reclaim the memory those objects use. How can this be achieved? It needs to go through *the whole heap* and check the flag of each object. If the flag is 0, the memory is reclaimed (or made available to be allocated again).

The complexity is linear to the size of the heap.

###Compact
The compaction algorithm description will be vaguer. Basically it goes through the live set again and *moves* objects in the memory so that all live objects are placed more tightly. Additionally, it *remaps* all the references to the moved objects, which can be more expensive than the moving part.

The complexity is linear to the size of the live set.

###Mark/Sweep/Compact collector
All of the 3 introduced algorithms make one big Mark/Sweep/Compact algorithm. As always, implementations may vary. It can be monolithic (all steps in one pass) or incremental (marking and sweeping in one pass, compact in different pass), mostly concurrent (e.g. only sweeping is done concurrently) or stop-the-world, etc. Almost all combinations are possible.

Overall complexity of Mark/Sweep/Compact is linear to the size of the heap. This complexity is dominated by complexity of Sweep. Heaps are getting bigger and bigger and this algorithm would become unpractical.

###Copying collector
There is another type of collector, which is called **copying collector**. It is using the [Cheney's algorithm](http://en.wikipedia.org/wiki/Cheney%27s_algorithm). Cheney introduced two regions of memory; he named one of them a **from-space** and the other one a **to-space**. Only one of those spaces can be used as a heap by the application at any given moment.

The collector is usually monolithic. First, it finds all live objects in from-space (by tracing) and then copies them to a to-space. It also updates the references along the way. When all live objects have been moved to a to-space, the whole from-space is discarded in one piece and to-space becomes a new heap. Additionally from-space and to-space switch their names in the next iteration of the algorithm.

The computation time of the algorithm is linear to the live set, which is faster than Mark/Sweep/Compact. But it comes at a price. To use this algorithm, you need to provide twice as much memory as your maximal heap... It is a classic example of space-time tradeoff.

##Generational collection
We now know all basic GC algorithms. Those algorithms are used in practical implementations, but not on their own. They are combined together and tuned based on many different factors that define the mutator (e.g. allocation rate).

**Generational garbage collectors** can be any of the introduced algorithms or mix of them. What makes them different is how they split the heap and use different **strategies** (algorithms) to each region of the memory. The memory is divided into **young generation** and **old generation**. Young generation is where all new objects are allocated. Old generation is where objects that survived at least one GC pass are held. This setting is based on a **weak generational hypothesis**, which states that:

1. most objects will soon become unreachable,
1. references from old to young objects exist in small amounts.

Basically it says that "most objects die young". This hypothesis lets us assume that garbage collection in the young generation is very efficient (the percentage of reclaimed memory is high). This way we get rid of almost-empty GC passes.

##Enter Java
Now it's time to talk about real life implementations that can be found in HotSpot JVM. We covered all the necessary theory so this should be piece of cake.

###Memory composition
In Java, the young generation is divided into 3 spaces: one **Eden space** and 2 **Survivor spaces**. Brand new objects are allocated in Eden space. Objects that survive one GC pass are copied to the current Survivor space. When the Survivor space becomes full, one more GC pass is performed and surviving objects are moved to the other Survivor space leaving the old Survivor space empty (much like in copying collector). Objects which survive all those steps are moved (or **promoted**) to the old generation.

The reasoning behind this approach is that often in the Eden space we are dealing with objects that were just created and will be dead in a moment. Hence promoting them to the old generation would cause the situation where old generation is filled with many yound and soon-to-be-dead objects. Thus the hypothesis would not hold.

Additionally, until Java 6, there was one more generation called **permanent generation**. It held metadata like classes or interned strings. In Java 8, it was replaced by native memory based **metaspace**. You can read more about it [here](http://javaeesupportpatterns.blogspot.com/2013/02/java-8-from-permgen-to-metaspace.html).

When garbage collection is performed in the young generation, we call it **minor GC**. When collection is performed in the old generation or metaspace, we call it **major GC** or **full GC**.

##HotSpot JVM garbage collectors
All of the following garbage collectors use different algorithms only for old generations. They all use stop-the-world copying collector for young generation.

###Parallel GC
This is the default GC and that makes it the most popular one. For old generation it uses monolithic Mark/Sweep/Compact algorithm.

###Serial GC
Serial GC should not be used in production environment. It uses the same algorithms as Parallel GC, but only in one thread.

###Concurrent Mark & Sweep GC
This garbage collector uses several algorithms for old generation. By default it uses *mostly* concurrent Mark & Sweep collector (that means no compaction). Mark algorithm is mostly concurrent (that means it is stop-the-world sometimes). The Sweep algorithm is fully concurrent.

Sometimes the concurrent algorithms cannot keep up with the changes in the heap caused by the mutator. Then the collector has to perform standard stop-the-world monolithic Mark/Sweep/Compact. This can also be the case when memory fragmentation reaches a critical level.

###G1 ("Garbage first") GC
This garbage collector is very similar to the Concurrent Mark & Sweep. However, it runs additional Compact algorithm for old generation and uses its stop-the-world mostly-incremental version.

##Further reading & watching
If you liked this post, you will definitely like the [talk by Gil Tene from Azul Systems](https://www.youtube.com/watch?v=we_enrM7TSY). He expands upon this blog post, plus he talks about **application memory wall** and fully concurrent garbage collector.

Many topics from this video are further explained in [this blog post from Cubrid](http://www.cubrid.org/blog/dev-platform/understanding-java-garbage-collection/).

If you are interested in GC tuning and memory fragmentation, please read JVM optimization series from JavaWorld, especially [part 3 about garbage collection](http://www.javaworld.com/article/2078645/java-se/jvm-performance-optimization-part-3-garbage-collection.html).

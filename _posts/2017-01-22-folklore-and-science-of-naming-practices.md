---
layout: post
title: Folklore and science of naming practices
tags: naming refactoring research clean-code
---

There are only two hard things in Computer Science: cache invalidation and naming things<sup>[1](#two-hard-things)</sup>. While cache invalidation seems like a very hard problem, naming problem is still underestimated by many professional programmers. In many legacy systems names are chosen arbitrarily. There are even systems where *"programmers chose to name procedures after their girlfriends or favorite sportsmen”*<sup>[2](#identifier-quality)</sup>.

Spotting a bad name is not very hard, but both good and great names go unnoticed. Names allow developers to share their current understanding with future developers (including themselves). Research shows that identifiers can take about 70% of modern software's source code<sup>[3](#concise-naming)</sup>, so one can argue that a naming strategy is the main contributor to software comprehension problems. We can take this hypothesis even further and state that a good understanding of naming problem may make you and your team go a lot faster. 

## What's the impact of naming?
Before we dig into the naming problem itself, I'd like to stop for a bit and think about the impact of naming. We know that identifiers take around 70% of source code, but do we know *how much time can our team save by having good identifier names*? Secondly, can we use the information about time savings to make better decisions while programming or reviewing someone else's code? I'd like to have a strategy for making a quick decision about names without depending on my faulty intuition.

Uncle Bob wrote that *"the ratio of time spent reading versus writing is well over 10 to 1"*<sup>[4](#clean-code)</sup>. This is probably true for *some* codebases. But let's not stop there and try to find a more accurate number based on real-life data. Data can be found in the [Microsoft Research paper](https://www.microsoft.com/en-us/research/publication/maintaining-mental-models-a-study-of-developer-work-habits/) that is a summary of responses from several hundred professional developers working at Microsoft.

Researchers created a developer activity catalogue:

- designing,
- writing,
- understanding the code,
- editing,
- unit testing,
- communicating,
- code maintenance overhead (building, compiling),
- other code related activities,
- non code activities.

It turned out that *"no single activity accounts for most of developer's time"*. The median times spent on each activity were very close. The research showed that those numbers are also a subject of vast variability depending on teams and lifecycles. Based on median values from the paper, **"understanding the code" activity accounts for about 10% of average developer's time.** Same can be written about both *writing* and *communicating* activities, which are also related to identifier naming<sup>[5](#work-habits)</sup>. 

Initially I wanted to know only how much time we spend on reading the code, but there was another side of this research that grabbed my attention. Developers were asked to name *the most difficult problems* they face in their work. The highest scoring problem was related to *understanding the code* activity and was serious for 66% of respondents.

| This is a serious problem for me                   | % agree |
| -------------------------------------------------- | ------- | 
| Understanding the rationale behind a piece of code | 66%     |
| Understanding code that someone else wrote         | 56%     | 
| Understanding the history of a piece of code       | 51%     | 
| Understanding code that I wrote a while ago        | 17%     |

*Most serious problems for Microsoft developers*<sup>[5](#work-habits)</sup>

---

Another research went into even more detail. Researchers analysed the impact of different attributes of the names on programmer's ability to process them <sup>[6](#identifier-length)</sup>. They concluded that **"longer names take an average of 20.1 s longer to process."**

Based on the research and experiments, we can conclude that:

- we spent substantial amount of time trying to understand the code,
- understanding the rationale behind a piece of code is the most difficult problem we face,
- longer names take an average of 20 seconds to process and this means that if you only have long descriptive identifiers, 70% of your code takes very long to process.

## Cargo cult of naming advices
Unfortunately, I think I don't really understand the naming problem. Instead, I have always followed *"good naming practices"* almost blindly. Majority of "naming convention"-related advices in professional literature are very superficial. They state that I should or should not do something and then "prove" that advice with some anecdotes. 

In the *"Clean Code"* book<sup>[4](#clean-code)</sup>, the chapter about names includes the following advices:

- use intention-revealing names,
- avoid disinformation,
- make meaningful distinctions,
- use pronounceable names,
- use searchable names,
- avoid encodings,
- avoid mental mapping,
- don't be cute,
- pick one word per concept,
- don't pun,
- use solution domain names,
- use problem domain names,
- add meaningful context,
- don't add gratuitous context.

Each of the above is explained using an example and some individual reasoning. Author uses phrases like *"I prefer..."*, *"I don't want"* and *"I choose"*. Don't get me wrong, this is a great book, but I can't help feeling that those statements are based only on intuition and experience. There are no references to any researches or experiments. And that makes it susceptible to *cargo cult*, because **programmers tend to follow these advices without deep understanding of their purpose**. If you have ever heard an argument like *"because Uncle Bob says so"*, then you definitely feel my pain.

But my feelings aside, let's list the problems with this kind of "best practices" approach:

- some of the advices seem to be addressed to only one programmer and overlook a more general causes of bad naming, where more than one person changes a piece of code over time,
- they usually focus on *syntactical* aspects, e.g. `lowercase package names`, `CamelCased class names`, 
- when they advise on *semantical* aspects of the names, they are very vague by just stating *"names should be meaningful, descriptive and self-documenting*".

> Clearly, only requiring “meaningful”, “descriptive”, or “self-documenting” names is insufficient. First, a name not only needs to be meaningful but reflect the correct meaning. Second, the “correct” meaning and name of a concept is naturally highly debatable.
>
> -- Deißenböck & Pizka <sup>[3](#concise-naming)</sup>

In this post I am going to give you some experimental research data and formal definitions of good names. This way you can become a better programmer by moving away from *folklore* of naming practices and base your naming skills on *science*. 

## Dealing with the naming problem

We now see that naming problem has a big impact on code comprehension. The naming activity may look straightforward, but we all know it isn't! In this section I want to go through the main reasons explaining why is that a case.

> The hardest thing about choosing good names is that it requires good descriptive skills and a shared cultural background.
>
> "Clean Code" <sup>[4](#clean-code)</sup>

### Formal definition of a name
In the great paper about consistent and concise naming<sup>[3](#concise-naming)</sup>, authors introduced two spaces, denoted `C` and `N`:

- `C` is a **concept space** - it includes all concepts relevant within a certain scope (project, company, team),
- `N` is a **names space** - it includes all possible names that programmers use in the source code.

During the lifetime of an application, programmers build a formal relation `R` between those two spaces - they assign *names* from `N` to *concepts* from `C`.

![Names, Concepts and Naming Relation](/images/naming-practices/names-concepts-relation.svg)

Having this definition, we can now try to find out what does it mean for the naming relation `R` to be *consistent*. First, let's look at two things that make the naming *inconsistent*.

#### Homonyms and synonyms
*Homonyms* are words with more than one meaning. In terms of source code, that means that programmers use one identifier (e.g. `book`) to name more than one concept (e.g. *a book* and *booking activity*). 

*Synonyms* are different words with the same meaning. A typical example is using two different identifiers, like `accountNumber` and `number`, to name one concept - *account number*.

![Homonyms & Synonyms](/images/naming-practices/homonyms-synonyms.svg)

> The mixture of synonyms and homonyms, which is commonly found in source codes, maximizes confusion and aggravates comprehension efforts enormously.
>
> -- Deißenböck & Pizka <sup>[3](#concise-naming)</sup>

#### Rule #1: Choose consistent names
A naming relation `R` is **consistent** if and only if the mapping is *bijective*, i.e. each identifier name from `N` is paired with only one concept from `C` and each concept from `C` is paired with only one identifier name from `N`.

#### Rule #2: Choose correct names
In order to define correctness, we need to introduce one more thing about concept space `C`: *partial ordering* `⊑` which orders concepts according to their level of abstraction. If concept set `C` contains both `permutation` and `transformation` concepts, then `permutation ⊑ transformation`, i.e. `transformation` is a generalization of `permutation`.

Hence, the naming relation `R` is **correct** if all identifier names from `N` correspond to the concept they are manifesting *or* a generalization of this concept. So, if you have a function that calculates and returns a `permutation` and you named it `transformation`, it's a correct name. However, the name is not concise enough.

#### Rule #3: Choose concise names
The naming relation `R` is concise if all identifier names from `N` have exactly the same name as the concept they stand for. That means that if your function calculates `permutation`, then you should use it as a name. 

Sounds easy, right? But, what if your concept space `C` had two permutation-like concepts:

- `permutationWithRepetition`,
- `permutationOfMultisets`?

Unfortunately, then naming any function `permutation` would not be concise (it would be correct, though). Why? Because it is a *generalization* of at least two concepts from your concept space `C`.

> The key to keep comprehensibility and detailing of identifiers in balance is to control the content of the concept space `C`!
>
> -- Deißenböck & Pizka <sup>[3](#concise-naming)</sup>

#### Advices from "Clean Code" revisited
Let's go back to *"Clean code"* book advises that we tend to follow and talk about. Having the aforementioned formal definition and 3 rules of good names we can convert the advices from the book to those 3 rules!

| Naming advice from *"Clean code"*<sup>[4](#clean-code)</sup> | Rule from *"Concise and Consistent Naming"*<sup>[3](#concise-naming)</sup> |
| ------------------------------------------------------------ |  
| use intention-revealing names | choose correct names         |
| avoid disinformation          | choose correct names         |
| make meaningful distinctions  | choose consistent names      |
| use pronounceable names       | choose correct names         |
| use searchable names          | choose correct names         |
| avoid encodings               | choose consistent names      |
| avoid mental mapping          | choose consistent names      |
| don't be cute                 | choose consistent names      |
| pick one word per concept     | choose consistent names      |
| don't pun                     | choose consistent names      |
| use solution domain names     | choose concise names         |
| use problem domain names      | choose concise names         |
| add meaningful context        | choose concise names         |
| don't add gratuitous context  | choose concise names         |

### Controlling the concept space
The immediate conclusion from the formal definition of consistent and concise naming is that we need to be able to prove that any given concept is represented with only one very specific name. We can make sure that this is the case by closely controlling the *concept space*. Unfortunately, in a vast majority of our projects it's *practically impossible*! Whenever I am adding a new identifier or changing a name of existing one, I am using my best judgement and intuition and focus on best *syntactic* practices. I am unable to implement any efficient *semantic* naming practices. I am unable to follow the 3 formal rules. And the root cause is that I don't have any direct access to the *set of concepts* in the scope of my application.

This gets even harder when we collaborate with other people. The mapping between names in the code and concepts in the application scope is rarely documented. To sum up: in many projects we expect people to implicitly agree on all terms in the code and remember those agreements during the project's lifetime... **That's why naming is so hard!**

As you see, the problem is even bigger than expected. A set of informal advices (like the one in *"Clean Code"*) is helpful just because we don't have anything better. 

## Identifier quality and code comprehension
Now we know that in order to create names, we need to precisely name the concepts in the finite, well-defined set. This is just one side of the problem, though. Even if we had *concise, correct & consistent* names, that could still cause problems in code comprehension! 

There are multiple research papers on identifier quality. Lawrie and others observed that longer names can make the other programmer slower (and even 20s slower for reading one identifier alone! <sup>[6](#identifier-length)</sup>). They attributed this fact to overloading a programmer’s short-term memory. They also tested and confirmed the hypothesis that using names that include ties to programmer persistent memory can vastly improve code comprehension (programmers can remember them easily and they stay longer in the memory). For example: `toString` has strong ties to Java programmers memory, while `getJournalEntry` doesn't.

> Maximal comprehension occurs when the pressure to create longer more expressive names is balanced against limited programmer short-term memory resources. 
> -- Binkley, Lawrie, Maex, Morrell <sup>[6](#identifier-length)</sup>

#### Rule #4: Choose shorter names
Whenever you are naming a concept, you need to choose a name that will minimise comprehension time. Choose as fewer syllables as possible and use words that have ties to programmer's (or your coworkers) memory.

**But doesn't it contradict the previous rules?** How can we choose names that are both concise and very short? Again, the power lies in *controlling the whole concept space*. In order to have short & concise names, we need to make sure that our concept space is as small as possible. And this alone is a hard work, because every time someone wants to introduce a new concept, we need to be able to rethink the whole set again!

### Maybe we should use abbreviations?
Takang and others run an experiment to test the following hypothesis: *"programs that contain 'full' identifier names are more understandable than those with abbreviated identifier names"*<sup>[7](#program-comprehensibility)</sup>. However, quantitative data collected doesn't support this hypothesis. Binkley and others shed some light on this discovery by presenting the following two code snippets<sup>[6](#identifier-length)</sup>. Which one do you think takes longer to process?

{% highlight js %}
distance_between_abscissae = first_abscissa-second_abscissa
distance_between_ordinates = first_ordinate-second_ordinate
cartesian_distance = square_root(
  distance_between_abscissae * distance_between_abscissae
  + distance_between_ordinates * distance_between_ordinates)
{% endhighlight %}

{% highlight js %}
dx = x1 - x2
dy = y1 - y2
dist = sqrt(dx * dx + dy * dy)
{% endhighlight %}

In a different paper Lawrie and others conclude that *"abbreviations are just as useful as the full-words"*<sup>[8](#effective-identifier)</sup>. However, please remember that we need to use only generally known abbreviations, like `dist` for distance, `len` for length and `char` for character. When you use `char` as an abbreviation for `characteristic`, the above conclusion doesn't hold.

## Rename refactoring revisited
Renaming is even harder than naming: it's just naming combined with convincing people to unlearn something... Based on a survey<sup>[9](#repent)</sup>, only 8% of developers think that renaming is straightforward. Even though we have IDE support in rename refactorings, it still can cause problems. The obvious problems are:

- renaming that breaks API compatibility,
- renaming names that are bound to runtime only (e.g. component discovery by name).

But a more general problem is that the *IDE renaming tool is too constrained*, because it only refactors *names*, not *concepts*. Every time a concept changes (or a new one is introduced), programmers need to somehow make sure that all names for this concept are aligned with the change. The same goes for identifiers. Every time identifier name changes, programmers needs to be sure that the name is still valid with all concepts and other related names. Knowing that human memory is very limited we can suspect that at least some of the concepts will not be renamed and this is when **decay** starts to spread in the codebase (compare with [Broken Windows theory](https://en.wikipedia.org/wiki/Broken_windows_theory)).

![Renaming and Code Decay](/images/naming-practices/renaming-decay.svg)

Deißenböck and Pizka run an experiment with their students that included a renaming of vital concept in the middle of the project lifetime. The conclusions were:

- the problem was ignored for a couple of weeks,
- after some time students working on the program were not able to comprehend its original meaning,
- they considered it a mess,
- re-engineering was very extensive even though the program was fairly small (13000 LOC).<sup>[3](#concise-naming)</sup>

The above can also be easily confirmed by looking at quantity of different identifiers used in open source projects. Data taken from [Concise and Consistent Naming paper](#concise-naming):

- **Eclipse 3.0M7** - 94,829 different identifiers (around the same number of words as in Oxford Advanced Learner’s Dictionary) which are compounds of 7,233 unique words,
- **Sun’s JDK 1.4.2** (1.3 MLOC) - 42,869 different identifiers that are compounds of 6,426 different words (you need to know around 5,000 English words to understand academic papers),
- **Tomcat 5.0.30** (317 kLOC) - 11,656 different identifiers composed from 2,587 words.

## Conclusion
Naming is hard. We dived deep into the topic and extracted 4 rules of naming that all developers should follow. However, following those rules in today's development environments is very hard, if not impossible. The biggest problem of naming is that programmers don't have tools to analyse and stop *names decay*. And since names are about 70% of the source, this contributes hugely to software decay as a whole. To get better at naming, we need to invent better tools. 

---
- <small><a name="two-hard-things">1</a>: Quote attributed to [Phil Karlton](https://martinfowler.com/bliki/TwoHardThings.html)</small>
- <small><a name="identifier-quality">2</a>: Lawrie, Feild, Binkley - *"Quantifying Identifier Quality: An Analysis of Trends"* [link](http://www.cs.loyola.edu/~lawrie/papers/lawrieJese07.pdf)</small>
- <small><a name="concise-naming">3</a>: Deißenböck & Pizka - *"Concise and Consistent Naming"* [link](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.70.618&rank=1)</small>
- <small><a name="clean-code">4</a>: Robert C. Martin - *"Clean Code: A Handbook of Agile Software Craftsmanship"*</small>
- <small><a name="work-habits">5</a>: LaToza, Venolia, DeLine - *"Maintaining Mental Models: A Study of Developer Work Habits"* [link](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.111.2317&rank=1)</small>
- <small><a name="identifier-length">6</a>: Binkley, Lawrie, Maex, Morrell - *"Identifier length and limited programmer memory"*</small>
- <small><a name="program-comprehensibility">7</a>: Takang, Grubb, Macredie - *"The effects of comments and identifier names on program comprehensibility: An experimental investigation"*</small>
- <small><a name="effective-identifier">8</a>: Lawrie, Morrell, Feild, Binkley - *"Effective Identifier Names for Comprehension and Memory"*</small>

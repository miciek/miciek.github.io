---
layout: post
title: "Using Haskell in CI pipelines"
summary: "Learn how to make your CI pipelines robust by replacing Bash scripts with Haskell scripts"
image: /images/haskell-in-pipelines/summary.png
tags: haskell ci continuous-delivery devops scripting turtle bash shell
published: false
---

Software architecture approaches have changed significantly in the recent years. We have all started to appreciate more fine-grained teams, which are developing modules with as few dependencies as possible. Continuous delivery provides tighter feedback loops and more stable releases. However, this came with a cost that hasn't really been articulated well enough.

Our microservices are being containerized, need to be monitored; we are becoming DevOps which need help of SREs to maintain the whole setup. The development of our modules is not the most difficult thing anymore. We are moving towards [Cynefin](https://en.wikipedia.org/wiki/Cynefin_framework) _complex_ environments. And this complexity is moved outside our systems, to our pipelines, where we have **scripts** that integrate all the modules, test them, define quality gates for systems and contracts between them.

This is a call for help. We need to get better at pipeline maintenance, especially high level ones that integrate many different microservices. This post introduces one of the ways to deal with the raising complexity of our pipelines: [Haskell](https://www.haskell.org/)/[Turtle](https://hackage.haskell.org/package/turtle) scripting.

## Scripts, scripts everywhere

Let's look at the tools we currently use in our pipelines[^periodic]:

* continuous integration (Jenkins, CircleCI, Travis CI, Gitlab CI),
* source control management (Git, Mercurial),
* build tools (npm, maven, make, sbt),
* repository management (npm, Artifactory, Nexus),
* testing tools (Junit, Selenium, mocha, Gatling),
* configuration/provisioning tools (Chef, Puppet, Ansible, Vagrant),
* containerization (Docker, Kubernetes, Mesos),
* cloud (AWS, OpenShift, Heroku).

One thing is missing. There is no **programming language**. Every tool has its own version of language and DSL. Some of them use Ruby, some of them use custom scripting languages, but many of them are not opinionated about the programming language and they are letting users choose.

And many users choose Bash or Python, because they can get the job done quickly. And they are right. But there's a catch.

The catch is that the scripts need to be maintained and extended. Once a small script that calls `curl`, now a big 200-hundred line beast with many `curls`, `ifs` and `echos`. And no tests.

In Python, the situation is not that bad, but still far from perfect. The thing is that you could, _possibly_, be writing unit tests for your CI Python scripts. And if you do write them, please don't read the rest of the post, because you are doing just fine!

The rest of the post is for you if you write CI scripts in Bash or any other dynamically typed language, you don't have (m)any tests for them, and every time you want to change it, you end up changing a thing and then running, debugging and fixing dozens of problems in your script until it does what you want.

## Why Haskell?

So why do I think Haskell is the right tool for the job? There are several reasons, but main one is: **handling effects using type system**. Scripts don't have any real business logic, so majority of them are just doing side effects. Dynamic languages, like Bash, don't let us specify what we really wanted to achieve and what kind of result should be delivered at the end of the script.

Haskell has strong types and type inference. Haskell doesn't let you do many things, it makes you rethink the solution when you are adding more features. That's the whole point: to make us more aware of what our scripts are doing.

Haskell can be overwhelming, but in this post I just want to show you a bare minimum, simple Haskell, which helps in majority of cases. You and your team need to decide whether that's enough or you want to go deeper than that.

The rest of the reasons can be found in FAQ section at the end of this post.

## What needs to be done?

I assume you are now somewhat convinced that Haskell _can be_ the tool to use in our ever-growing pipeline scripts. Now it's time to go through some examples. Firstly, let's list the most common operations[^common-operations] we do in our pipeline scripts:

* calling native build tools (building, testing),
* creating artifacts,
* creating configuration files based on templates,
* validating configuration files,
* calling HTTP services (registering changes, notifications, deployments, pushing metrics).

### Example pipeline

Based on the above, I decided to create an average example pipeline, which will look like that:

1. build applications in subdirectories (`frontend` and `backend`),
1. build Docker images,
1. deploy locally (kill the old containers & run new ones using specific port),
1. verify that deployment has finished with the correct version,
1. send notification with the result of the pipeline.

Some of the above will be faked as much as possible so that we can stay focused on the real deal: the pipeline scripts. For example, "building" the applications means generating the version and zipping static files, because I didn't want to use any build tool in the example. The pipeline itself can be encoded as a simple list of steps in Bash:

```bash
#!/usr/bin/env bash

./build_apps.sh
./build_images.sh
./deploy_apps.sh
./check_deployment.sh
./notify.sh
```

This script, named `bash_pipeline.sh`, is only needed for the purpose of this post and it wouldn't be needed in normal circumstances. Normally, we would encode these steps in a YAML file, e.g. when using [Travis CI](https://travis-ci.org/) or [Gitlab CI](https://about.gitlab.com/features/gitlab-ci-cd/). Configuration of these tools are out of the scope of this blog post, but if you are curious how to use Haskell in one of the above, please have a look at the [companion code repository](https://github.com/miciek/bashing-out-with-haskell).

I assume that your pipelines are far more sophisticated than the one above, but I hope this is still enough to show you how Haskell scripts can help even in this simple case.

## Bash hacker approach

So what would be the standard Bash approach to our example pipeline?

## Haskell to the rescue!

### Anatomy of a Haskell script

Second line is Stack specific. It means that it will always use [LTS Haskell 10.8 (ghc-8.2.2)](https://www.stackage.org/lts-10.8) and that the script will not get outdated after years.

## The Twist: pipeline monitoring

Imagine that we now want to add metrics to our pipeline. We want to know how long do they take, and what are the success and failure ratios for each of the states.

That means we need to be able to push metrics to Prometheus Push Gateway from our scripts.

## FAQ

#### But you can have functions in Bash!

#### Why do I need to learn another language?

#### Isn't it all hype forced to us by developers who are always (and will be) bored?

#### Bash is the right tool for the job (TM)

#### Python is the right tool for this job (TM)

#### Go is the right tool for this job (TM)

#### What if I want to quickly change the behavior?

#### Isn't it too slow?

#### But why can't I use the language I use for the project?

#### My manager says that this is just a hype and I need to get back to work instead of trying to learn new things.

Well, getting out of the comfort zone is one of the things that make organizations great. Learning new things can potentially benefit the whole organization in different, surprising places. Haskell is a different approach, it is already proven to work. Learning Haskell in a safe environment like pipelines will benefit your team, even when the main project is written using different technology. Haskell-inspired ideas are coming into languages:

* JavaScript (ramda),
* TypeScript,
* Elm,
* PureScript,
* Scala (scalaz, cats, scalacheck),
* Java (Vavr),
* Kotlin,
* F#.

And many more! Those ideas are similar in different languages. So, if you are a manager and you are reading this, please encourage your team to try Haskell out. They will get frustrated, because it's a new language, unfamiliar language, but this will have real benefits, unlike the "benefits" of learning advanced Bash.

### But why can't I use my build tool to do all that?

Using plugins, like Docker plugin.

## Summary

The main premise however, is that we need to get better at scripting our pipelines. Quick and dirty hacking is no longer a viable option when the product consists of several systems.

## Acknowledgments

This post wouldn't be possible if not for two great websites that allowed me to write _working_ Bash scripts. I am grateful to have met you:

* [Explain Shell](https://explainshell.com)
* [Stack Overflow](https://stackoverflow.com/)

I did my best to write _readable_ Bash scripts, but I may be biased. So if you think some of the scripts in this post can be written in a nicer way, please let me know. I will happily apply all fixes.

---

[^periodic]: [DevOps Periodic Table](https://xebialabs.com/periodic-table-of-devops-tools/)
[^common-operations]: The list of "common operations in average pipeline" is highly opinionated. Your mileage may vary.

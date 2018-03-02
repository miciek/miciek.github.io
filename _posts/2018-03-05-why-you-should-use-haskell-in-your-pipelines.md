---
layout: post
title: "Why you should use Haskell in your pipelines"
summary: ""
image: /images/haskell-in-pipelines/summary.png
tags: haskell ci continuous-delivery devops scripting turtle
published: false
---

DevOps culture and Continuous Delivery approaches have been very popular in recent years. We have all started to appreciate the good things about this movement. But there are still some rough edges, which I struggled to pinpoint... Until recently.

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

And many users choose Bash or Python, because they can get the job done quickly. So where's the catch?

The problem is that the scripts need to be maintained and extended. Once a small script that calls `curl`, now a big 200-hundred line beast with many `curls`, `ifs` and `echos`. And no tests.

In Python, the situation is not that bad, but still far from perfect. The thing is that _possibly_ you could be writing unit tests for your CI Python scripts. And if you do write them, please don't read the rest of the post, because you are doing just fine!

The rest of the post is for you if you write CI scripts in Bash or any other dynamically typed language, you don't have (m)any tests for them, and every time you want to change it, you end up changing a thing or two and then running and debugging your script until it does what you want.

## What needs to be done?

Let's first list the most common operations we do in our pipeline scripts:

* calling native build tools (building, testing),
* creating artifacts,
* creating configuration files based on templates,
* validating configuration files,
* calling HTTP services (registering changes, checking health-checks, deploying),
* notifying (Slack, e-mail).

## Example: Average Pipeline

### Bash hacker approach

## FAQ

### But you can have functions in Bash!

### Why do I need to learn another language?

### Bash is the right tool for the job (TM)

### Python is the right tool for this job (TM)

### Go is the right tool for this job (TM)

### What if I want to quickly change the behavior?

### Isn't it too slow?

### But why can't I use the language I use for the project?

---

[^periodic]: [DevOps Periodic Table](https://xebialabs.com/periodic-table-of-devops-tools/)

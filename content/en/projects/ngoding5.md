---
title: Ngoding5
description: Indonesian-language practice site for programming logic and syntax, five minutes per problem — write a function and run the test cases, or read a program and guess its exact output.
type: engineering
category: Web app · Education
year: 2026
role: Full-stack Developer
company: Personal project
featured: false
order: 15
cover: /images/lab/ngoding5.webp
technologies: [Vue 3, Vite, TypeScript, CodeMirror, Go, PostgreSQL, Redis, Docker]
contribution:
  mine: Sole developer — product concept, problem bank and verification, Vue front end, Go API and sandbox runner, admin panel, deployment.
links:
  - { label: Live site, url: "https://ngoding5-static.vercel.app/" }
  - { label: GitHub (static version), url: https://github.com/kikiraihan/ngoding5-static }
  - { label: Teaser video, url: /videos/ngoding5-teaser.mp4 }
---

## Teaser video

::video-player{src="/videos/ngoding5-teaser.mp4" poster="/images/lab/ngoding5.webp" caption="Five minutes of coding, sharper logic: a FizzBuzz in the wrong order, a hint, all test cases passing, then the sort() trap in JavaScript." live="https://ngoding5-static.vercel.app/"}
::

## What it does

*Ngoding* is Indonesian slang for "coding". Ngoding5 is a place to sharpen programming logic and syntax in short sessions, free and without signing up.

- **Write code**: a typed function signature becomes a ready-made skeleton in the editor. Run the sample cases, read the expected vs. actual output, open tiered hints, then submit to be tested against hidden cases too. The explanation and reference solution unlock after you pass.
- **Guess the output**: read a short program and type (or pick) exactly what it prints — the answers come from real execution, including each language's classic traps, like `sort()` on numbers in JavaScript.
- **Progress on your device**: solved problems, correct guesses, a daily streak and an activity calendar, kept locally and exportable.

## Two editions

- **Static version** (live): no server at all. JavaScript runs in a Web Worker and Python through Skulpt, right in the browser; 40 coding problems and 32 quizzes, verified by running the JS and Python solutions against each other.
- **Full version** (shown in the video): every submission runs for real in six languages — JavaScript, Python, PHP, Java, C++ and Go — inside a single-use Docker container with no network, a non-root user, a read-only root filesystem and CPU, memory and PID limits (gVisor in production). The Go API only queues jobs on Redis Streams and compares the results, so hidden cases never reach the browser; editors manage problems through an admin panel with review, versioning and "verify all languages" before publishing.

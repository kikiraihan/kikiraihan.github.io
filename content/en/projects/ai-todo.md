---
title: AI Todo
description: A todo list and reminder app you can run by chatting with an AI or by hand — one Go binary with SQLite, an installable PWA and a macOS menu bar app, where the AI only proposes actions and the server validates them.
type: engineering
category: Product · AI assistant
year: 2026
timeline: Oct 2026 — Nov 2026
role: Full-stack Developer
company: Personal project
featured: false
order: 11
cover: /images/work/ai-todo/todo.webp
technologies: [Go, SQLite, Vue 3, PWA, Web Push, Swift, AppKit, Docker]
metrics:
  - value: "3"
    label: free AI providers with fallback
  - value: "6"
    label: reminder schedule types
  - value: "1"
    label: binary + one SQLite file
architecture:
  - id: clients
    label: PWA & Mac menu bar app
    detail: Vue 3 PWA for phone, tablet and PC (Web Push), plus a native AppKit menu bar app with a badge, quick check-off, a chat panel (⌥⌘T) and local notifications.
  - id: api
    label: Go HTTP API
    detail: Session cookies (HttpOnly, Secure, SameSite=Strict), a required CSRF header, login rate limits, strict CSP. Every query is scoped to the user.
  - id: assistant
    label: Assistant
    detail: The model returns a JSON action plan. Only whitelisted operations are accepted; deletes and bulk changes wait for a confirm button, and every batch can be undone.
  - id: core
    label: Core
    detail: The same validation as the manual forms. The AI never writes to the database directly.
  - id: scheduler
    label: Scheduler
    detail: Reminder times are computed by the server, not the AI — once, daily, weekly, monthly, yearly, or every N minutes inside a time window.
  - id: ai
    label: AI providers
    detail: kenari, Agnes AI and OpenRouter free models with fallback in admin-defined order. Keys live only in the server environment; hosts are allowlisted.
contribution:
  mine: Sole developer — product spec, Go server, Vue PWA, Swift menu bar app, CI/CD and deployment.
links:
  - { label: GitHub, url: https://github.com/kikiraihan/mac-os-ai-todo }
---

## Problem

Todo apps make you fill in forms; chat assistants forget what you told them yesterday and can't be trusted to touch your data. I wanted to type *"tomorrow at 9 remind me to call the workshop, and mark buy water done"* and have it happen — on my phone and on my Mac — without giving an AI free rein over a database.

## Context

A personal tool, built to run cheaply on my own VPS: free AI models only, one small server, and notifications on every device I use. Everything the chat can do must also be possible by hand, so the app stays useful when the AI is down or wrong.

## Solution

- **Chat as a shortcut**: add, edit, complete, delete, search and summarise todos and reminders from one chat box. Actions show up as cards with an **Undo** button; deletes and bulk changes ask for confirmation first. Slash commands (`/todo`, `/hari-ini`, `/undo`) work without any AI at all.
- **Manual is complete**: todo lists with Today / Upcoming / No date / Done tabs, search, lists, priority, notes, and reminders that can be one-off or recurring with an end date, a count, snooze and pause.
- **An assistant that remembers**: a profile and notes (inspired by Hermes Agent) are sent with every message and can be reviewed, edited and exported. Memory is scanned before saving and rejects passwords, PINs, tokens, card numbers and prompt-injection patterns.
- **Notifications everywhere**: Web Push for the PWA, native notifications with *Done* / *Snooze 10 min* on the Mac, plus a morning summary and overdue nudges.
- **Separate admin mode**: AI model catalog (test, enable, fallback order), assistant persona and limits, AI call log and system log — with no endpoint that can read another user's todos, chats or memory.

## Architecture

::architecture-explorer{:nodes="architecture"}
::

## Technical challenges

- **Keeping the AI out of the database.** The model can only propose a JSON plan. The server checks each operation against a whitelist, validates its shape, runs it through the same core functions as the forms inside a transaction, and records an undo entry.
- **Free models are unreliable.** The client tolerates odd replies, falls back across providers in order, and logs every outgoing call so the admin can see which model failed and why.
- **Recurring schedules are easy to get wrong.** The scheduler — not the AI — computes every next occurrence in the user's time zone and stores times as UTC, with tests for windows, month ends, end dates and counts.
- **A Mac app without a Mac in CI.** The HTTP client is Foundation-only, so it is tested on Linux against the real Go server; the AppKit part is compiled and released by a macOS GitHub Actions workflow.
- **Deploys that can't brick the server.** Each merge to `main` backs up the database, rebuilds the container, runs a health check and rolls back automatically if it fails.

## Impact

::metric-grid{:metrics="metrics"}
::

## Lessons learned

Treat the language model as a user with a very fast keyboard, not as part of the backend: give it the same forms everyone else gets, make dangerous actions need a human click, and make everything undoable. That one rule kept the rest of the design simple.

## Snapshots

::gallery
---
images:
  - { src: /images/work/ai-todo/chat.webp, alt: Assistant chat with an action card and Undo }
  - { src: /images/work/ai-todo/todo-dark.webp, alt: Today's todos in dark mode }
  - { src: /images/work/ai-todo/reminders-dark.webp, alt: Recurring reminders computed by the server }
  - { src: /images/work/ai-todo/memory.webp, alt: AI memory — profile and assistant notes }
---
::

![The PWA on a phone: assistant, todo (swipe right to complete, left to edit or delete) and reminders](/images/work/ai-todo/phones.webp)

::gallery
---
fit: contain
images:
  - { src: /images/work/ai-todo/mac-todo.webp, alt: Mac menu bar app — Todo tab, caption: "Mac menu bar app, Todo tab: quick add, Today / All / Done, check off with one click. Illustration based on the app's AppKit layout." }
  - { src: /images/work/ai-todo/mac-chat-dark.webp, alt: Mac menu bar app — Chat tab in dark mode, caption: "Chat tab (⌥⌘T) in dark mode: actions appear as a card with Undo. Illustration based on the app's AppKit layout." }
---
::

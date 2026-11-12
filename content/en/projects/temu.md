---
title: Temu
description: A little pixel version of you (or your pet) that lives on the Mac screen of the people closest to you — walking along the bottom edge, falling asleep, dancing and delivering your greetings.
type: engineering
category: macOS app · Web app
year: 2026
role: Full-stack Developer
company: Personal project
featured: false
order: 14
cover: /images/lab/temu.webp
technologies: [Swift, AppKit, Go, PostgreSQL, Vue 3, Vite, AI]
contribution:
  mine: Sole developer — product concept, Swift menu bar app, Go API and generate worker, Vue web app and admin, CI/CD and deployment.
links:
  - { label: Live site, url: "https://temu.katili.dev" }
  - { label: GitHub, url: https://github.com/kikiraihan/lite-mac-os-live-companion }
  - { label: Teaser video, url: /videos/temu-teaser.mp4 }
---

## Teaser video

::video-player{src="/videos/temu-teaser.mp4" poster="/images/lab/temu.webp" caption="A little way to be together: from a pet napping on a Mac screen to a greeting delivered by a friend's pet." live="https://temu.katili.dev"}
::

## What it does

*Temu* is Indonesian for "to meet". It puts a small pixel version of you on the Mac of your partner, best friend or family: it walks along the bottom of the screen, naps (more often at night), dances on its own, sneezes, chases butterflies and sometimes comes back with a gift. Far away, but it still feels like you're right next to them.

- **A pet on the desktop**: click to pet it, double-click to make it jump, drag to pick it up and drop it (from high up, it gets dizzy). Its menu bar icon moves too.
- **Three ways to make yourself small**: pick one of five built-in pets, draw your own in a 32×32 pixel editor (16 poses), or upload a photo and let AI draw you — or copy the prompt into your own ChatGPT and upload the result; the server crops it, removes the background and cleans it up into pixel art.
- **Friends and greetings**: invite by link or username. Once they allow it, you walk around on their Mac next to their own pet, and your little self delivers your messages.
- **Separate admin room**: users, pets, generate history, audit trail, AI provider connections with fallback order (keys stored encrypted), daily generate quota.

## Presence, not surveillance

The Mac app is deliberately just a toy: it never reads the screen, keystrokes, clipboard or files, never asks for Accessibility or Screen Recording permission, and never holds a password — it links to an account through a device code and keeps only a device token in the Keychain. Uploaded photos are deleted as soon as the pet is drawn.

## How it's built

- **Mac app**: Swift + AppKit with no dependencies, macOS 13+, Apple Silicon and Intel. The built-in pets are written as text in the source (one character = one pixel) and rendered into the sprite sheets the server uses.
- **One pet format in three places**: a 128×128 PNG sprite sheet, a 4×4 grid of 32×32 poses, in the same order in the Go server, the Vue web app and the Swift app.
- **Server**: Go + PostgreSQL — user API, admin API, Mac app API and a generate worker; admins and users have separate tables, sessions, cookies and CSRF.
- **Web**: Vue 3 + Vite, designed as a desktop: a dark menu bar on top and a floor at the bottom where your pet actually walks and can be picked up, just like on the Mac.
- **Releases**: bumping the version on `main` builds, packages and publishes a new Temu.zip and installer from a macOS GitHub Actions runner.

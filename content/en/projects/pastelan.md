---
title: PasteLAN
description: Copy-paste text and images between a Mac and a phone through your own server — a Swift menu bar app, a single Go binary that keeps clips in memory only, and an installable PWA.
type: engineering
category: macOS app · PWA · Server
year: 2026
role: Developer
company: Personal project
featured: false
order: 14
cover: /images/lab/pastelan.webp
technologies: [Swift, AppKit, Go, PWA, Web Push, ChaCha20-Poly1305]
contribution:
  mine: Sole developer — Mac app, Go server, PWA, security model and release pipeline.
links:
  - { label: GitHub, url: "https://github.com/kikiraihan/mac-os-PasteLAN" }
  - { label: Teaser video, url: "https://github.com/kikiraihan/mac-os-PasteLAN/blob/main/video/pastelan-teaser.mp4" }
---

## Teaser video

::video-player{src="https://github.com/kikiraihan/mac-os-PasteLAN/blob/main/video/pastelan-teaser.mp4" poster="/images/lab/pastelan.webp" caption="Copy on the Mac, it shows up on the phone; send from the phone, ⌘V on the Mac."}
::

## What it does

- **Mac → phone**: every ⌘C on the Mac (text, screenshots, images from the browser or Finder) appears on the phone within about a second, with a **Copy** button.
- **Phone → Mac**: paste text or pick images, tap **Send**, then ⌘V on the Mac. The phone and the Mac don't need to be on the same Wi-Fi.
- **Clipboard manager on the Mac**: history in the menu (⌘0–⌘9), search, delete with ⌥-click, send a single clip with ⌃-click, and an offline mode when autosync is off.
- **No server?** A local Wi-Fi mode runs a tiny server on the Mac; the phone pairs by scanning a QR code and everything is encrypted with ChaCha20-Poly1305 using the key in that code.

## How it's built

- **Mac app**: Swift + AppKit in a single source file, token in the Keychain, signed self-updates (Ed25519). Content from password managers is never sent.
- **Server**: one Go binary with no dependencies, listening on localhost behind HTTPS. Clips live **in memory only** (20 items / 24 hours by default) and disappear on restart.
- **Security**: one-time pairing codes valid for 5 minutes, per-device tokens stored as hashes, login rate limits, `HttpOnly` + `SameSite=Strict` cookies, a strict CSP and images checked by their content.

## Snapshots

::gallery
---
fit: contain
images:
  - { src: /images/work/pastelan/phone-light.webp, alt: PasteLAN on a phone (light) }
  - { src: /images/work/pastelan/phone-dark.webp, alt: PasteLAN on a phone (dark) }
---
::

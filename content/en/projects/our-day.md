---
title: Our Day
description: A shared photo album for weddings and events, filled by the guests themselves — scan a QR code, type a name and shoot straight from the browser into a live gallery.
type: engineering
category: Web app · PWA · SaaS
year: 2026
role: Full-stack Developer
company: Personal project
featured: false
order: 13
cover: /images/lab/our-day.webp
technologies: [Vue 3, TypeScript, Pinia, Tailwind CSS, Go, SQLite, PWA, Web Push]
contribution:
  mine: Sole developer — product concept, Vue PWA, Go API, admin panel, CI/CD and deployment.
links:
  - { label: Live site, url: "https://ourday.katili.dev" }
  - { label: Teaser video, url: /videos/ourday-teaser.mp4 }
---

## Teaser video

::video-player{src="/videos/ourday-teaser.mp4" poster="/images/lab/our-day.webp" caption="Scan, shoot, share: the guest flow from QR code to the shared gallery."}
::

## What it does

The best photos of a wedding are on the guests' phones, and they rarely reach the couple. Our Day collects them on the day itself: the host prints a QR poster, guests scan it, type their name — no account, no app to install — and take photos straight from the browser.

- **Camera in the browser** with 12 filters picked *before* the shutter and burned into the photo, Locket-style stickers (text, time, current weather, location, emoji) and deliberately **no retake button**.
- **Live shared gallery** with ❤️ reactions, plus **voice messages** of up to 60 seconds with a live waveform.
- **For hosts**: event setup with themes and photo limits per guest, gallery moderation, guest management, a new access code if the QR leaks, and a **ZIP download** of everything, streamed without buffering in memory.
- **For the platform admin**: clients, events, subscription plans, cross-event moderation, site settings for the landing page and an activity log.

## How it's built

- **Frontend**: Vue 3 + TypeScript, Pinia and Tailwind CSS v4, mobile-first, light/dark theme without a white flash.
- **Backend**: Go 1.24 with the standard `net/http` router, SQLite through `modernc.org/sqlite` (pure Go, no cgo — one binary), JWT with separate audiences for guests and dashboards, image resizing in pure Go.
- **PWA**: installable from two entry points (the host dashboard and the guest gallery), an offline shell so the gallery still opens when the venue's signal drops, and updates applied only after a tap — never in the middle of someone taking a photo.
- **Web Push** with VAPID and no third-party service: hosts hear about new and pending uploads, guests hear when their photo is approved, throttled to once per 10 minutes per event so a hundred guests don't mean a hundred buzzes.

---
title: Digimosque
description: Nearest-mosque search API and a 15-module admin panel for a digital mosque platform.
type: engineering
category: Backend · Admin
year: 2022
timeline: Mar 2022 — May 2022
role: Web Developer (Project based)
company: Digimosque
featured: true
order: 5
cover: /images/work/digimosque/digi6.png
technologies: [Laravel, Livewire, REST API]
metrics:
  - value: "15"
    label: admin modules
  - value: "< 2 mo"
    label: to build the admin panel
architecture:
  - id: android
    label: Android app
    detail: Mosque discovery, donations, takmir features.
  - id: api
    label: Laravel API
    detail: Includes the nearest-mosque search algorithm.
  - id: db
    label: Database
    detail: Redesigned to support new features while keeping legacy data.
  - id: admin
    label: Livewire admin panel
    detail: Mosque data, IoT device access, takmir verification.
contribution:
  team: Built with two other developers; deployment support from the team.
  mine: Nearest-mosque search API and other endpoints, database redesign input, and the entire admin panel.
links:
  - label: Company profile
    url: https://www.linkedin.com/company/digimosque
  - label: Play Store
    url: https://play.google.com/store/search?q=digimosque&c=apps
---

## Problem

Digimosque is a digital mosque platform: find mosques nearby, donate to religious activities, manage mosque cash / infaq / qurban, and connect IoT devices (displays, AC, prayer times). The Android prototype needed a real API, and administrators needed a web panel.

## Context

The existing data had to be kept, so we reverse-engineered the old database and adjusted it for new features. The deadline was close.

## Solution

- Advised on the **database redesign** with the product manager.
- Built the **nearest-mosque search** API and several other endpoints.
- Built the **entire admin panel** with **Livewire** — reusable components made it possible to ship 15 modules in under two months.

## Architecture

::architecture-explorer{:nodes="architecture"}
::

## Impact

::metric-grid{:metrics="metrics"}
::

The app is available on the Play Store.

## Lessons learned

Picking a tool for the deadline, not for the résumé: Livewire let me reuse components and move fast without building a separate SPA.

## Snapshots

::gallery
---
images:
  - { src: /images/work/digimosque/digi1.png, alt: Admin panel }
  - { src: /images/work/digimosque/digi2.png, alt: Admin panel }
  - { src: /images/work/digimosque/digi3.png, alt: Admin panel }
  - { src: /images/work/digimosque/digi4.png, alt: Admin panel }
---
::

<iframe src="https://www.youtube-nocookie.com/embed/uFxaXUciovo" title="DigiMosque Box & DigiMosque Mobile Apps" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

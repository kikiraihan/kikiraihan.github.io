---
title: TimeMarket
description: A workload-management PWA for Bank Indonesia's Gorontalo office that balances how work is delegated across employees.
type: engineering
category: Product · Full-stack
year: 2021
timeline: May 2021 — Aug 2022
role: Web Developer (Contract)
company: Bank Indonesia — Gorontalo Office
featured: true
order: 3
cover: /images/work/timemarket/timemarket.png
technologies: [Laravel, Livewire, PWA, MySQL]
metrics:
  - value: "4"
    label: user roles with distinct permissions
  - value: "6 mo"
    label: full-stack build of v1
  - value: "v2"
    label: contract extended for a second version
architecture:
  - id: client
    label: Mobile-first PWA
    detail: Installable from Chrome so it behaves like a native Android app.
  - id: ui
    label: Livewire components
    detail: Interactive UI without a separate SPA, which kept development fast.
  - id: app
    label: Laravel application
    detail: Programmes (proker), jobs, delegation rules and the role/permission model.
  - id: db
    label: MySQL
    detail: Employees, programmes, jobs and workload history.
contribution:
  mine: Full-stack development of v1 and v2, the PWA mode, and the user manual.
links:
  - label: timemarket.masuk.id
    url: https://timemarket.masuk.id
---

## Problem

As part of Bank Indonesia's internal innovation programme, the Gorontalo office needed a way to delegate work accurately, monitor it, and keep each employee's workload within a reasonable limit.

## Context

It had to be usable from anywhere and easy for every employee — from staff to the head of office. Four roles were involved: **Employee**, **Team Leader (Chief)**, **Head of Office (KPw)** and **Admin**, each with different rights over programmes (*proker*) and jobs.

## Solution

- An interactive UI with **Livewire** to keep development fast.
- **Mobile-first** design so it works equally well on desktop and phones.
- A **semi-PWA** mode: with the right metadata, the app can be installed from Chrome and opened like a native Android app.
- A user manual for rollout.

<video src="/images/work/timemarket/timemarket_homescreen.webm" controls muted playsinline preload="none"></video>

## Architecture

::architecture-explorer{:nodes="architecture"}
::

## Technical challenges

The permission model was the core of the product: who can create, edit, transfer or complete a job depends on the role *and* on whether the user leads that programme.

| Feature | Employee | Chief | Head of Office | Admin |
| --- | --- | --- | --- | --- |
| View programmes & jobs | Yes | Yes | Yes | Yes |
| Add programme | — | Yes | — | — |
| Edit programme | If programme lead | Yes | — | Yes |
| Add / edit / delete job | If programme lead | If programme lead | — | — |
| Transfer job to others | If programme lead | If programme lead | — | — |
| Mark job completed | Yes | — | — | — |
| Main calendar | Yes | Yes | Yes | — |

## Impact

::metric-grid{:metrics="metrics"}
::

The contract was extended for a second version, delivered in 3 months, followed by 6 months of maintenance.

## Lessons learned

For internal tools, adoption beats features. Making it installable on the phones people already carried did more for usage than any single feature.

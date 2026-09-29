---
title: Jadwalin
description: Faculty-scale course scheduling with conflict rules and a greedy auto-generator, fed by Excel exports instead of a locked API.
type: engineering
category: Product · Algorithm
year: 2022
timeline: Apr 2022 — May 2022
role: Full-stack Developer
company: IAIN Sultan Amai Gorontalo
featured: true
order: 6
cover: /images/work/jadwalin/jadwalin3.png
technologies: [Laravel, Greedy algorithm, Excel import]
metrics:
  - value: "4"
    label: conflict rules enforced
  - value: "2 mo"
    label: build time
architecture:
  - id: excel
    label: Excel exports from SIAK
    detail: Course data and sample schedules, since direct API access wasn't allowed.
  - id: import
    label: Import & validation
    detail: Familiar Excel workflow for staff.
  - id: rules
    label: Rule engine
    detail: Department, lecturer, room and credit-hour (SKS) constraints as Laravel rules.
  - id: generator
    label: Greedy generator
    detail: Automatically proposes a conflict-free schedule.
contribution:
  mine: Sole developer — analysis, rules, generator and UI.
---

## Problem

The Faculty of Islamic Economics and Business at IAIN Sultan Amai Gorontalo needed to manage course schedules faculty-wide without clashes.

## Context

Course data lived in the Academic Information System (SIAK), but API access was not permitted. What staff *did* have were Excel exports.

## Solution

- **Excel-based import**, so staff keep the workflow they know and integration doesn't depend on SIAK access.
- Four conflict rules, implemented as Laravel validation rules so new ones are easy to add:
  1. **Department** — a major's schedule may not collide.
  2. **Lecturer** — a lecturer can't teach two classes at once.
  3. **Room** — a room can't be double-booked.
  4. **Credits (SKS)** — the course's credits must match the time slot.
- An **automatic schedule generator** using a greedy algorithm.

## Architecture

::architecture-explorer{:nodes="architecture"}
::

## Impact

::metric-grid{:metrics="metrics"}
::

## Lessons learned

When the ideal integration isn't available, meet users where their data already is. Excel import was less elegant than an API — and far more useful.

## Snapshots

::gallery
---
images:
  - { src: /images/work/jadwalin/jadwalin3.png, alt: Schedule overview }
  - { src: /images/work/jadwalin/jadwalin1.png, alt: Schedule management }
  - { src: /images/work/jadwalin/jadwalin2.png, alt: Schedule detail }
---
::

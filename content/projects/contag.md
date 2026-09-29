---
title: Contag School
description: Backend API modules for a SaaS platform that manages university academic affairs.
type: engineering
category: Backend · SaaS
year: 2023
timeline: Mar 2023 — Oct 2023
role: Backend Engineer
company: Contag School
featured: true
order: 4
cover: /images/work/contag/c2.jpeg
technologies: [NestJS, Node.js, TypeScript]
metrics:
  - value: "20+"
    label: API modules delivered
  - value: "800+"
    label: commits
architecture:
  - id: clients
    label: Back office & app
    detail: Admin back office and the end-user application.
  - id: api
    label: NestJS API
    detail: Modular services with dependency injection, one module per domain.
  - id: domain
    label: Academic domain modules
    detail: 20+ modules covering academic-affairs workflows.
  - id: db
    label: Database
    detail: Persistent academic data.
contribution:
  team: Product direction and the client apps were owned by the Contag team.
  mine: Backend API modules, following SOLID and clean-code practices.
links:
  - label: contag.id
    url: https://contag.id/
---

## Problem

Contag School builds SaaS products for university academic-affairs management. They needed a robust backend so their back office and apps could share data and automate workflows.

## Solution

I developed **more than 20 API modules** on **NestJS**, tailored to Contag's academic workflows, and kept a steady delivery rhythm with **800+ commits**.

## Architecture

::architecture-explorer{:nodes="architecture"}
::

## Technical challenges

- Keeping a growing number of modules consistent and independent — NestJS modules + dependency injection helped enforce boundaries.
- Applying **SOLID** principles so new features extend the system instead of rewriting it.

## Impact

::metric-grid{:metrics="metrics"}
::

## Lessons learned

With many modules, conventions matter more than cleverness. Clear naming and consistent structure made the codebase easy for the rest of the team to pick up.

## Snapshots

::gallery
---
images:
  - { src: /images/work/contag/c1.jpeg, alt: Back office }
  - { src: /images/work/contag/c2.jpeg, alt: App }
---
::

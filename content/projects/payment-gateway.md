---
# DRAFT — not published (draft: true). Fill in and review every metric before setting draft: false.
# PRD §25: no credentials, internal URLs, merchant/customer data or non-disclosable architecture.
title: Payment Gateway
description: High-volume payment infrastructure for B2B and B2C transactions.
type: engineering
category: Payments · Backend
year: 2025
timeline: 2025 — Present
role: Software Engineer
company: SingaPay
featured: true
order: 0
draft: true
cover: /images/profile/portrait.jpg
technologies: [Laravel, PHP, PostgreSQL, Redis]
metrics:
  - value: "500K–800K"
    label: transactions / day (verify before publishing)
architecture:
  - { id: client, label: Client / Merchant, detail: TODO }
  - { id: gateway, label: API Gateway, detail: TODO }
  - { id: payment, label: Payment Service, detail: TODO }
  - { id: processing, label: Transaction Processing, detail: TODO }
  - { id: provider, label: Provider, detail: TODO }
  - { id: settlement, label: Settlement, detail: TODO }
contribution:
  team: TODO — what the team/company built.
  mine: TODO — what I personally designed or implemented.
---

## Problem

TODO

## Context

TODO

## Solution

TODO

## Architecture

::architecture-explorer{:nodes="architecture"}
::

## Technical challenges

- Idempotency — TODO
- Race conditions — TODO
- Data consistency — TODO

## Impact

::metric-grid{:metrics="metrics"}
::

## Lessons learned

TODO

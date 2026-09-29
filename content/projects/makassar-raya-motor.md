---
title: Spatial Sales Intelligence
description: Spatial analysis and an interactive dashboard that maps sales performance across 3 provinces down to 7,394 villages for a Daihatsu dealer group.
type: engineering
category: Data · Geo-web
year: 2024
timeline: Oct 2023 — Jun 2024
role: Software Engineer & Data Analyst (Contract)
company: PT. Makassar Raya Motor
featured: true
order: 2
cover: /images/work/makassar-raya-motor/mrm1.jpeg
technologies: [Python, FastAPI, Plotly, Laravel Livewire, GeoJSON]
metrics:
  - value: "3"
    label: provinces analysed
  - value: "709"
    label: sub-districts mapped
  - value: "7,394"
    label: villages covered
architecture:
  - id: data
    label: Sales data + BPS indicators
    detail: Dealer sales records combined with GDP, per-capita income and population data from Statistics Indonesia (BPS).
  - id: geo
    label: GeoJSON boundaries
    detail: Province, district and sub-district boundaries prepared with the spatial mapping team.
  - id: api
    label: FastAPI spatial service
    detail: Processes spatial data and powers the mapping features.
  - id: viz
    label: Plotly dashboards
    detail: Interactive maps and charts per province, district and sub-district.
  - id: app
    label: Laravel Livewire web app
    detail: Data management, imports and the embedded dashboards in one place.
contribution:
  team: Map design was done together with urban-planning experts on the spatial mapping team.
  mine: Spatial analysis, the Plotly dashboards, the FastAPI backend and the Livewire web application.
links:
  - label: Client profile
    url: https://daihatsumrm.co.id/
---

## Problem

PT. Makassar Raya Motor runs 10 Daihatsu branches across South, Central and Southeast Sulawesi. Sales decisions were made without a clear geographic view of where demand was strong, weak, or untapped.

## Context

Sales data existed, but not tied to geography or to socio-economic context. The analysis had to work at multiple levels — province, district, sub-district and village — and be usable by non-technical stakeholders.

## Solution

- **Spatial analysis** of sales across 3 provinces, 54 districts, 709 sub-districts and 7,394 villages.
- **Maps with context** — combined with GDP, per-capita income and population indicators from BPS, designed together with urban-planning experts.
- **Interactive dashboards** built with Python Plotly.
- **A full-stack web app** (Laravel Livewire) for data management, imports and the embedded dashboards, backed by a **FastAPI** service for spatial processing.

## Architecture

::architecture-explorer{:nodes="architecture"}
::

## Technical challenges

- Absorbing and cleaning GeoJSON for three provinces at several administrative levels.
- Keeping maps responsive while rendering hundreds of sub-district polygons.
- Joining sales records to administrative areas consistently.

## Impact

::metric-grid{:metrics="metrics"}
::

Stakeholders could explore sales performance next to socio-economic indicators at a glance, instead of reading spreadsheets per branch.

## Lessons learned

The value of a dashboard is in the questions it lets people ask. Pairing sales with public socio-economic data turned "where did we sell?" into "where *should* we sell?".

## Snapshots

::gallery
---
images:
  - { src: /images/work/makassar-raya-motor/mrm1.jpeg, alt: Map analysis }
  - { src: /images/work/makassar-raya-motor/mrm3.jpeg, alt: Dashboard analysis }
  - { src: /images/work/makassar-raya-motor/mrm2.jpeg, alt: Data management }
  - { src: /images/work/makassar-raya-motor/mrm4.jpeg, alt: Data import feature }
---
::

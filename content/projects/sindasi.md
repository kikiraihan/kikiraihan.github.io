---
title: Sindasi
description: A student information and recommendation system using AHP-TOPSIS with configurable criteria weights.
type: engineering
category: Decision Support
year: 2021
role: Full-stack Developer & Researcher (Undergraduate thesis)
company: Universitas Negeri Gorontalo
order: 8
cover: /images/work/sindasi/sindasi1.png
technologies: [Laravel, AHP-TOPSIS, MySQL]
metrics:
  - value: "5"
    label: user roles
links:
  - label: Published paper
    url: https://ejurnal.ung.ac.id/index.php/jji/article/view/10246
---

## Problem

Departments regularly need to pick suitable students — for scholarships, competitions, or research assistance — but criteria change from case to case.

## Solution

**Sindasi** combines complete student information (academic and non-academic) with a dynamic decision-support engine based on **AHP** (Analytical Hierarchy Process) and **TOPSIS**. Users define criteria and pairwise comparisons, save them as *preferences*, and generate recommendations from those preferences. Each recommendation can weigh criteria differently.

| Feature | Lecturer | Head of Dept. | Head of Program | Student | Admin |
| --- | --- | --- | --- | --- | --- |
| Student list & profiles | Advisees | All | Program only | Own | All |
| Criteria master | View | View | View | — | Full |
| Preference master | Own | All | Own | — | All |
| Auto recommendation | — | Yes | Yes | — | — |
| Import data | — | Yes | — | — | Yes |

## Lessons learned

Making the weights configurable turned a one-off thesis tool into something reusable for many decisions.

## Snapshots

::gallery
---
images:
  - { src: /images/work/sindasi/sindasi1.png, alt: Dashboard }
  - { src: /images/work/sindasi/sindasi2.png, alt: Recommendation }
  - { src: /images/work/sindasi/sindasi3.png, alt: Student profile }
---
::

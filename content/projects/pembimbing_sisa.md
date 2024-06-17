---
title: "Jadwalin : Course Schedule Management System"
date: 2022-04-25
cover: "/projects/jadwalin/jadwalin3.png"
bidang: ["Fullstack-web"]
tags: ["PHP-Laravel"]
---

# Jadwalin

### Brief :
The Faculty of Islamic Economics and Business, IAIN Sultan Amai Gorontalo, requires a system to manage course schedules on a faculty scale. Available course data and sample schedules are in the form of excell files, which are obtained from the Academic Information System (SIAK). In this case, access through the SIAK API is not permitted for certain reasons.
The system must consider:
1. Department → the schedule for students in one major may not collide.
2. Lecturer → check the teaching lecturer whether there are also courses at the same time.
3. Room → check whether the room is already occupied at the same time.
4. SKS -> check the course credits if they match the credits in the clock slot. (credits are a semester credit unit).

**Working time:** 2 months

**Date :** April – May 2022

### Solution :
To solve the problem in the brief given the following solutions:
- The input feature is built using the export data excell principle, to make it easier for users who are used to working with excell files, and facilitate integration because they do not yet have access to SIAT.
- The making of the feature has taken into account 4 dibrief matters, Department, Lecturer, Room, Credits, and features can be easily added because they are made in the Laravel rule system.
- There is an automatic schedule generator feature using a greedy algorithm.

#### Screenshot :
| ![/projects/jadwalin/jadwalin3.png](/projects/jadwalin/jadwalin3.png) |
| -------------- |

| ![/projects/jadwalin/jadwalin1.png](/projects/jadwalin/jadwalin1.png) | ![/projects/jadwalin/jadwalin2.png](/projects/jadwalin/jadwalin2.png) |
| -------------- | -------------- |
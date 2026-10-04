---
title: Contag School
description: Modul API backend untuk platform SaaS yang mengelola urusan akademik perguruan tinggi.
type: engineering
category: Backend · SaaS
year: 2023
timeline: Mar 2023 — Okt 2023
role: Backend Engineer
company: Contag School
featured: true
order: 4
cover: /images/work/contag/c2.jpeg
technologies: [NestJS, Node.js, TypeScript]
metrics:
  - value: "20+"
    label: modul API dikerjakan
  - value: "800+"
    label: commit
architecture:
  - id: clients
    label: Back office & aplikasi
    detail: Back office untuk admin dan aplikasi untuk pengguna akhir.
  - id: api
    label: NestJS API
    detail: Layanan modular dengan dependency injection, satu modul per domain.
  - id: domain
    label: Modul domain akademik
    detail: Lebih dari 20 modul yang mencakup alur kerja urusan akademik.
  - id: db
    label: Database
    detail: Data akademik yang persisten.
contribution:
  team: Arah produk dan aplikasi klien dipegang oleh tim Contag.
  mine: Modul API backend, mengikuti prinsip SOLID dan praktik clean code.
links:
  - label: contag.id
    url: https://contag.id/
---

## Masalah

Contag School membangun produk SaaS untuk pengelolaan urusan akademik perguruan tinggi. Mereka membutuhkan backend yang andal agar back office dan aplikasinya bisa berbagi data dan mengotomatiskan alur kerja.

## Solusi

Saya mengembangkan **lebih dari 20 modul API** di atas **NestJS**, disesuaikan dengan alur kerja akademik Contag, dan menjaga ritme pengiriman yang stabil dengan **800+ commit**.

## Arsitektur

::architecture-explorer{:nodes="architecture"}
::

## Tantangan teknis

- Menjaga modul yang terus bertambah tetap konsisten dan independen — modul NestJS + dependency injection membantu menegakkan batasannya.
- Menerapkan prinsip **SOLID** agar fitur baru memperluas sistem, bukan menulis ulang sistem.

## Dampak

::metric-grid{:metrics="metrics"}
::

## Pelajaran

Dengan banyak modul, konvensi lebih penting daripada kecerdikan. Penamaan yang jelas dan struktur yang konsisten membuat codebase mudah dipahami oleh anggota tim lainnya.

## Cuplikan

::gallery
---
images:
  - { src: /images/work/contag/c1.jpeg, alt: Back office }
  - { src: /images/work/contag/c2.jpeg, alt: Aplikasi }
---
::

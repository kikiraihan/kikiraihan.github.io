---
title: Jadwalin
description: Penjadwalan kuliah skala fakultas dengan aturan bentrok dan generator otomatis berbasis algoritma greedy, bersumber dari ekspor Excel alih-alih API yang terkunci.
type: engineering
category: Produk · Algoritma
year: 2022
timeline: Apr 2022 — Mei 2022
role: Full-stack Developer
company: IAIN Sultan Amai Gorontalo
featured: true
order: 6
cover: /images/work/jadwalin/jadwalin3.png
technologies: [Laravel, Greedy algorithm, Excel import]
metrics:
  - value: "4"
    label: aturan bentrok yang ditegakkan
  - value: "2 bln"
    label: waktu pengerjaan
architecture:
  - id: excel
    label: Ekspor Excel dari SIAK
    detail: Data mata kuliah dan contoh jadwal, karena akses API langsung tidak diizinkan.
  - id: import
    label: Impor & validasi
    detail: Alur kerja Excel yang sudah familier bagi staf.
  - id: rules
    label: Rule engine
    detail: Batasan program studi, dosen, ruangan, dan SKS sebagai validation rule Laravel.
  - id: generator
    label: Generator greedy
    detail: Mengusulkan jadwal bebas bentrok secara otomatis.
contribution:
  mine: Satu-satunya developer — analisis, aturan, generator, dan UI.
---

## Masalah

Fakultas Ekonomi dan Bisnis Islam IAIN Sultan Amai Gorontalo perlu mengelola jadwal kuliah di seluruh fakultas tanpa bentrok.

## Konteks

Data mata kuliah ada di Sistem Informasi Akademik (SIAK), tetapi akses API tidak diizinkan. Yang *dimiliki* staf adalah file ekspor Excel.

## Solusi

- **Impor berbasis Excel**, sehingga staf tetap memakai alur kerja yang mereka kenal dan integrasinya tidak bergantung pada akses SIAK.
- Empat aturan bentrok, diimplementasikan sebagai validation rule Laravel sehingga aturan baru mudah ditambahkan:
  1. **Program studi** — jadwal satu program studi tidak boleh bertabrakan.
  2. **Dosen** — seorang dosen tidak bisa mengajar dua kelas sekaligus.
  3. **Ruangan** — satu ruangan tidak boleh dipesan dua kali.
  4. **SKS** — jumlah SKS mata kuliah harus sesuai dengan slot waktunya.
- **Generator jadwal otomatis** menggunakan algoritma greedy.

## Arsitektur

::architecture-explorer{:nodes="architecture"}
::

## Dampak

::metric-grid{:metrics="metrics"}
::

## Pelajaran

Ketika integrasi ideal tidak tersedia, temui pengguna di tempat data mereka sudah berada. Impor Excel memang kurang elegan dibanding API — tapi jauh lebih berguna.

## Cuplikan

::gallery
---
images:
  - { src: /images/work/jadwalin/jadwalin3.png, alt: Ringkasan jadwal }
  - { src: /images/work/jadwalin/jadwalin1.png, alt: Manajemen jadwal }
  - { src: /images/work/jadwalin/jadwalin2.png, alt: Detail jadwal }
---
::

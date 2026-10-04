---
title: Digimosque
description: API pencarian masjid terdekat dan panel admin 15 modul untuk platform masjid digital.
type: engineering
category: Backend · Admin
year: 2022
timeline: Mar 2022 — Mei 2022
role: Web Developer (Berbasis proyek)
company: Digimosque
featured: true
order: 5
cover: /images/work/digimosque/digi6.png
technologies: [Laravel, Livewire, REST API]
metrics:
  - value: "15"
    label: modul admin
  - value: "< 2 bln"
    label: untuk membangun panel admin
architecture:
  - id: android
    label: Aplikasi Android
    detail: Pencarian masjid, donasi, fitur takmir.
  - id: api
    label: Laravel API
    detail: Termasuk algoritma pencarian masjid terdekat.
  - id: db
    label: Database
    detail: Didesain ulang untuk mendukung fitur baru sambil tetap mempertahankan data lama.
  - id: admin
    label: Panel admin Livewire
    detail: Data masjid, akses perangkat IoT, verifikasi takmir.
contribution:
  team: Dibangun bersama dua developer lain; dukungan deployment dari tim.
  mine: API pencarian masjid terdekat dan endpoint lainnya, masukan untuk desain ulang database, dan seluruh panel admin.
links:
  - label: Profil perusahaan
    url: https://www.linkedin.com/company/digimosque
  - label: Play Store
    url: https://play.google.com/store/search?q=digimosque&c=apps
---

## Masalah

Digimosque adalah platform masjid digital: mencari masjid terdekat, berdonasi untuk kegiatan keagamaan, mengelola kas / infak / kurban masjid, dan menghubungkan perangkat IoT (layar, AC, jadwal sholat). Prototipe Android-nya membutuhkan API sungguhan, dan pengurus membutuhkan panel web.

## Konteks

Data yang sudah ada harus dipertahankan, jadi kami melakukan reverse-engineering terhadap database lama dan menyesuaikannya untuk fitur baru. Tenggat waktunya sudah dekat.

## Solusi

- Memberi masukan untuk **desain ulang database** bersama product manager.
- Membangun API **pencarian masjid terdekat** dan beberapa endpoint lainnya.
- Membangun **seluruh panel admin** dengan **Livewire** — komponen yang bisa dipakai ulang memungkinkan 15 modul selesai dalam waktu kurang dari dua bulan.

## Arsitektur

::architecture-explorer{:nodes="architecture"}
::

## Dampak

::metric-grid{:metrics="metrics"}
::

Aplikasinya tersedia di Play Store.

## Pelajaran

Memilih tool demi tenggat waktu, bukan demi CV: Livewire memungkinkan saya memakai ulang komponen dan bergerak cepat tanpa membangun SPA terpisah.

## Cuplikan

::gallery
---
images:
  - { src: /images/work/digimosque/digi1.png, alt: Panel admin }
  - { src: /images/work/digimosque/digi2.png, alt: Panel admin }
  - { src: /images/work/digimosque/digi3.png, alt: Panel admin }
  - { src: /images/work/digimosque/digi4.png, alt: Panel admin }
---
::

<iframe src="https://www.youtube-nocookie.com/embed/uFxaXUciovo" title="DigiMosque Box & DigiMosque Mobile Apps" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

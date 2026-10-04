---
title: TimeMarket
description: PWA manajemen beban kerja untuk Kantor Perwakilan Bank Indonesia Gorontalo yang menyeimbangkan pendelegasian pekerjaan antarpegawai.
type: engineering
category: Produk · Full-stack
year: 2021
timeline: Mei 2021 — Agu 2022
role: Web Developer (Kontrak)
company: Bank Indonesia — Kantor Perwakilan Gorontalo
featured: true
order: 3
cover: /images/work/timemarket/timemarket.png
technologies: [Laravel, Livewire, PWA, MySQL]
metrics:
  - value: "4"
    label: peran pengguna dengan hak akses berbeda
  - value: "6 bln"
    label: pengembangan full-stack v1
  - value: "v2"
    label: kontrak diperpanjang untuk versi kedua
architecture:
  - id: client
    label: PWA mobile-first
    detail: Bisa diinstal dari Chrome sehingga berperilaku seperti aplikasi Android native.
  - id: ui
    label: Komponen Livewire
    detail: UI interaktif tanpa SPA terpisah, sehingga pengembangan tetap cepat.
  - id: app
    label: Aplikasi Laravel
    detail: Program kerja (proker), pekerjaan, aturan pendelegasian, serta model peran/hak akses.
  - id: db
    label: MySQL
    detail: Pegawai, program kerja, pekerjaan, dan riwayat beban kerja.
contribution:
  mine: Pengembangan full-stack v1 dan v2, mode PWA, dan buku panduan pengguna.
links:
  - label: timemarket.masuk.id
    url: https://timemarket.masuk.id
---

## Masalah

Sebagai bagian dari program inovasi internal Bank Indonesia, kantor perwakilan Gorontalo membutuhkan cara untuk mendelegasikan pekerjaan secara tepat, memantaunya, dan menjaga beban kerja setiap pegawai dalam batas yang wajar.

## Konteks

Aplikasinya harus bisa dipakai dari mana saja dan mudah bagi setiap pegawai — dari staf hingga kepala kantor. Ada empat peran yang terlibat: **Pegawai**, **Ketua Tim (Chief)**, **Kepala Kantor (KPw)**, dan **Admin**, masing-masing dengan hak berbeda atas program kerja (*proker*) dan pekerjaan.

## Solusi

- UI interaktif dengan **Livewire** agar pengembangan tetap cepat.
- Desain **mobile-first** sehingga sama baiknya di desktop maupun ponsel.
- Mode **semi-PWA**: dengan metadata yang tepat, aplikasi bisa diinstal dari Chrome dan dibuka seperti aplikasi Android native.
- Buku panduan pengguna untuk proses peluncuran.

<video src="/images/work/timemarket/timemarket_homescreen.webm" controls muted playsinline preload="none"></video>

## Arsitektur

::architecture-explorer{:nodes="architecture"}
::

## Tantangan teknis

Model hak akses adalah inti produknya: siapa yang boleh membuat, mengubah, memindahkan, atau menyelesaikan pekerjaan bergantung pada peran *dan* pada apakah pengguna tersebut memimpin program kerja itu.

| Fitur | Pegawai | Chief | Kepala Kantor | Admin |
| --- | --- | --- | --- | --- |
| Melihat program kerja & pekerjaan | Ya | Ya | Ya | Ya |
| Menambah program kerja | — | Ya | — | — |
| Mengubah program kerja | Jika ketua proker | Ya | — | Ya |
| Menambah / mengubah / menghapus pekerjaan | Jika ketua proker | Jika ketua proker | — | — |
| Memindahkan pekerjaan ke orang lain | Jika ketua proker | Jika ketua proker | — | — |
| Menandai pekerjaan selesai | Ya | — | — | — |
| Kalender utama | Ya | Ya | Ya | — |

## Dampak

::metric-grid{:metrics="metrics"}
::

Kontraknya diperpanjang untuk versi kedua, yang selesai dalam 3 bulan, disusul 6 bulan pemeliharaan.

## Pelajaran

Untuk tool internal, adopsi mengalahkan fitur. Membuatnya bisa diinstal di ponsel yang sudah dibawa orang setiap hari berdampak lebih besar pada pemakaian dibanding fitur mana pun.

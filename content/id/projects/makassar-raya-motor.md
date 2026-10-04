---
title: Intelijen Penjualan Spasial
description: Analisis spasial dan dashboard interaktif yang memetakan kinerja penjualan di 3 provinsi hingga 7.394 desa untuk grup dealer Daihatsu.
type: engineering
category: Data · Geo-web
year: 2024
timeline: Okt 2023 — Jun 2024
role: Software Engineer & Data Analyst (Kontrak)
company: PT. Makassar Raya Motor
featured: true
order: 2
cover: /images/work/makassar-raya-motor/mrm1.jpeg
technologies: [Python, FastAPI, Plotly, Laravel Livewire, GeoJSON]
# metric values keep the comma as thousands separator; MetricCounter shows them as 7.394 on the Indonesian site
metrics:
  - value: "3"
    label: provinsi dianalisis
  - value: "709"
    label: kecamatan dipetakan
  - value: "7,394"
    label: desa tercakup
architecture:
  - id: data
    label: Data penjualan + indikator BPS
    detail: Catatan penjualan dealer digabung dengan data PDRB, pendapatan per kapita, dan jumlah penduduk dari Badan Pusat Statistik (BPS).
  - id: geo
    label: Batas wilayah GeoJSON
    detail: Batas provinsi, kabupaten/kota, dan kecamatan yang disiapkan bersama tim pemetaan spasial.
  - id: api
    label: Layanan spasial FastAPI
    detail: Mengolah data spasial dan menjalankan fitur-fitur pemetaan.
  - id: viz
    label: Dashboard Plotly
    detail: Peta dan grafik interaktif per provinsi, kabupaten/kota, dan kecamatan.
  - id: app
    label: Aplikasi web Laravel Livewire
    detail: Manajemen data, impor, dan dashboard yang tertanam dalam satu tempat.
contribution:
  team: Desain peta dikerjakan bersama para ahli perencanaan wilayah di tim pemetaan spasial.
  mine: Analisis spasial, dashboard Plotly, backend FastAPI, dan aplikasi web Livewire.
links:
  - label: Profil klien
    url: https://daihatsumrm.co.id/
---

## Masalah

PT. Makassar Raya Motor mengelola 10 cabang Daihatsu di Sulawesi Selatan, Sulawesi Tengah, dan Sulawesi Tenggara. Keputusan penjualan diambil tanpa gambaran geografis yang jelas tentang di mana permintaan kuat, lemah, atau belum tergarap.

## Konteks

Data penjualan sudah ada, tetapi tidak terhubung dengan geografi maupun konteks sosial-ekonomi. Analisisnya harus bekerja di beberapa tingkat — provinsi, kabupaten/kota, kecamatan, dan desa — dan bisa dipakai oleh pemangku kepentingan non-teknis.

## Solusi

- **Analisis spasial** penjualan di 3 provinsi, 54 kabupaten/kota, 709 kecamatan, dan 7.394 desa.
- **Peta yang punya konteks** — dipadukan dengan indikator PDRB, pendapatan per kapita, dan jumlah penduduk dari BPS, dirancang bersama para ahli perencanaan wilayah.
- **Dashboard interaktif** yang dibangun dengan Python Plotly.
- **Aplikasi web full-stack** (Laravel Livewire) untuk manajemen data, impor, dan dashboard yang tertanam, didukung layanan **FastAPI** untuk pemrosesan spasial.

## Arsitektur

::architecture-explorer{:nodes="architecture"}
::

## Tantangan teknis

- Menyerap dan membersihkan GeoJSON untuk tiga provinsi di beberapa tingkat administratif.
- Menjaga peta tetap responsif saat merender ratusan poligon kecamatan.
- Menggabungkan catatan penjualan dengan wilayah administratif secara konsisten.

## Dampak

::metric-grid{:metrics="metrics"}
::

Pemangku kepentingan bisa menjelajahi kinerja penjualan berdampingan dengan indikator sosial-ekonomi dalam sekali lihat, alih-alih membaca spreadsheet per cabang.

## Pelajaran

Nilai sebuah dashboard ada pada pertanyaan yang bisa diajukan orang melaluinya. Memadukan data penjualan dengan data sosial-ekonomi publik mengubah "di mana kita berjualan?" menjadi "di mana kita *seharusnya* berjualan?".

## Cuplikan

::gallery
---
images:
  - { src: /images/work/makassar-raya-motor/mrm1.jpeg, alt: Analisis peta }
  - { src: /images/work/makassar-raya-motor/mrm3.jpeg, alt: Analisis dashboard }
  - { src: /images/work/makassar-raya-motor/mrm2.jpeg, alt: Manajemen data }
  - { src: /images/work/makassar-raya-motor/mrm4.jpeg, alt: Fitur impor data }
---
::

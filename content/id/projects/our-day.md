---
title: Our Day
description: Album foto bersama untuk pernikahan dan acara, diisi sendiri oleh para tamu — pindai QR, ketik nama, lalu memotret langsung dari peramban ke galeri yang tampil seketika.
type: engineering
category: Web app · PWA · SaaS
year: 2026
role: Full-stack Developer
company: Proyek pribadi
featured: false
order: 13
cover: /images/lab/our-day.webp
technologies: [Vue 3, TypeScript, Pinia, Tailwind CSS, Go, SQLite, PWA, Web Push]
contribution:
  mine: Pengembang tunggal — konsep produk, PWA Vue, API Go, panel admin, CI/CD, dan deploy.
links:
  - { label: Situs, url: "https://ourday.katili.dev" }
  - { label: Video teaser, url: /videos/ourday-teaser.mp4 }
---

## Video teaser

::video-player{src="/videos/ourday-teaser.mp4" poster="/images/lab/our-day.webp" caption="Pindai, jepret, bagikan: alur tamu dari kode QR sampai galeri bersama." live="https://ourday.katili.dev"}
::

## Apa yang dilakukan

Foto terbaik sebuah pernikahan ada di HP para tamu, dan jarang sampai ke pengantin. Our Day mengumpulkannya di hari itu juga: tuan rumah mencetak poster QR, tamu memindainya, mengetik nama — tanpa akun, tanpa pasang aplikasi — lalu memotret langsung dari peramban.

- **Kamera di peramban** dengan 12 filter yang dipilih *sebelum* rana ditekan dan dibakar ke foto, stiker ala Locket (teks, jam, cuaca terkini, lokasi, emoji), dan sengaja **tanpa tombol foto ulang**.
- **Galeri bersama yang langsung tampil** dengan reaksi ❤️, plus **pesan suara** hingga 60 detik dengan visual gelombang langsung.
- **Untuk tuan rumah**: pembuatan acara dengan tema dan batas foto per tamu, moderasi galeri, manajemen tamu, kode akses baru bila QR bocor, dan **unduh ZIP** semua media yang dialirkan tanpa ditampung di memori.
- **Untuk admin platform**: klien, acara, paket langganan, moderasi lintas acara, pengaturan teks landing page, dan log aktivitas.

## Cara dibangun

- **Frontend**: Vue 3 + TypeScript, Pinia, dan Tailwind CSS v4, mobile-first, tema terang/gelap tanpa kedipan putih.
- **Backend**: Go 1.24 dengan router `net/http` bawaan, SQLite lewat `modernc.org/sqlite` (murni Go, tanpa cgo — satu biner), JWT dengan audiens terpisah untuk tamu dan dasbor, resize gambar murni Go.
- **PWA**: bisa dipasang dari dua pintu (dasbor tuan rumah dan galeri tamu), kerangka luring sehingga galeri tetap terbuka saat sinyal gedung hilang, dan pembaruan baru dipasang setelah tombol ditekan — tidak pernah di tengah seseorang memotret.
- **Web Push** dengan VAPID tanpa layanan pihak ketiga: tuan rumah dikabari soal kiriman baru dan yang menunggu persetujuan, tamu dikabari saat fotonya lolos moderasi, diredam maksimal sekali per 10 menit per acara supaya seratus tamu tidak berarti seratus getaran.

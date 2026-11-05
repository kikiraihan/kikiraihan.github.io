---
title: LiteScroller
description: Pemisah menu bar macOS yang ringan untuk menyembunyikan ikon, plus mode scroller yang membuat ikon tersembunyi tetap terjangkau walau tertutup menu aplikasi yang panjang atau notch.
type: engineering
category: macOS app · Menu bar
year: 2026
role: Developer
company: Proyek pribadi
featured: false
order: 15
cover: /images/lab/lite-scroller.webp
technologies: [Swift, AppKit, macOS, Accessibility API]
contribution:
  mine: Pengembang tunggal — aplikasi Swift, installer, dan workflow rilis.
links:
  - { label: GitHub, url: "https://github.com/kikiraihan/mac-os-lite-menu-bar-scroller" }
  - { label: Video teaser, url: "https://github.com/kikiraihan/mac-os-lite-menu-bar-scroller/blob/main/video/litescroller-teaser.mp4" }
---

## Video teaser

::video-player{src="https://github.com/kikiraihan/mac-os-lite-menu-bar-scroller/blob/main/video/litescroller-teaser.mp4" poster="/images/lab/lite-scroller.webp" caption="Ikon menu bar yang tersembunyi dalam strip yang bisa digulir, tetap terjangkau di samping menu aplikasi yang panjang."}
::

## Kenapa dibuat

Pemisah seperti Hidden Bar mendorong ikon keluar layar dan mengembalikannya saat dibuka — tapi kalau menu aplikasi aktif panjang (*File, Edit, View, History, Bookmarks, …*) atau layarnya ber-notch, macOS tetap menyembunyikan sebagian ikon, tanpa cara untuk menjangkaunya. LiteScroller tetap menyembunyikan ikon itu dan menampilkannya di strip yang **menimpa** area menu aplikasi, dan kalau masih belum cukup lebar, strip itu bisa digulir.

## Apa yang dilakukan

- Mode **buka-tutup** dan **buka-tutup timpa**: sembunyikan atau tampilkan ikon di kiri pemisah `|` dengan sekali klik; mode kedua juga menyembunyikan menu teks aplikasi selama terbuka, supaya ikon yang dibuka punya ruang.
- **Mode scroller**: strip di atas menu bar berisi **semua** ikon tersembunyi, digulir dengan trackpad atau roda mouse; klik ikon untuk membukanya.
- **Mode dropdown**: semua ikon tersembunyi sebagai daftar menu lengkap dengan gambar dan namanya.
- Tutup otomatis setelah 5–60 detik, buka saat login, ikut tema terang/gelap, tanpa polling (CPU 0% saat diam), update dan uninstall dari menu.

## Cara dibangun

Swift + AppKit murni dalam satu file sumber, tanpa dependensi. Mode scroller dan dropdown membaca item menu bar dan "menekan" ikon yang diklik lewat Accessibility API macOS; dengan izin rekam layar, strip menampilkan gambar asli tiap ikon, dipotret walau ikonnya sedang di luar layar.

## Cuplikan

::gallery
---
fit: contain
images:
  - { src: /images/work/litescroller/menubar-modes.webp, alt: Mode tampilan di menu bar, caption: "Mode-mode tampilan berdampingan. Mockup — tampilan asli bisa sedikit berbeda." }
  - { src: /images/work/litescroller/menu.webp, alt: Menu pengaturan LiteScroller }
---
::

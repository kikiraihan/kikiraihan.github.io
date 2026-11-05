---
title: PasteLAN
description: Copy-paste teks dan gambar antara Mac dan HP lewat server sendiri — aplikasi menu bar Swift, satu binary Go yang menyimpan clip hanya di memori, dan PWA yang bisa di-install.
type: engineering
category: macOS app · PWA · Server
year: 2026
role: Developer
company: Proyek pribadi
featured: false
order: 14
cover: /images/lab/pastelan.webp
technologies: [Swift, AppKit, Go, PWA, Web Push, ChaCha20-Poly1305]
contribution:
  mine: Pengembang tunggal — aplikasi Mac, server Go, PWA, model keamanan, dan pipeline rilis.
links:
  - { label: GitHub, url: "https://github.com/kikiraihan/mac-os-PasteLAN" }
  - { label: Video teaser, url: "https://github.com/kikiraihan/mac-os-PasteLAN/blob/main/video/pastelan-teaser.mp4" }
---

## Video teaser

::video-player{src="https://github.com/kikiraihan/mac-os-PasteLAN/blob/main/video/pastelan-teaser.mp4" poster="/images/lab/pastelan.webp" caption="Copy di Mac, muncul di HP; kirim dari HP, ⌘V di Mac."}
::

## Apa yang dilakukan

- **Mac → HP**: setiap ⌘C di Mac (teks, screenshot, gambar dari browser atau Finder) muncul di HP dalam sekitar satu detik, lengkap dengan tombol **Salin**.
- **HP → Mac**: tempel teks atau pilih gambar, tekan **Kirim**, lalu ⌘V di Mac. HP dan Mac tidak perlu berada di Wi-Fi yang sama.
- **Clipboard manager di Mac**: riwayat langsung di menu (⌘0–⌘9), pencarian, hapus dengan ⌥-klik, kirim satu clip dengan ⌃-klik, dan mode offline saat autosync dimatikan.
- **Tidak punya server?** Mode Wi-Fi lokal menjalankan server kecil di Mac; HP cukup memindai QR code dan semua isi dienkripsi ChaCha20-Poly1305 dengan kunci di kode itu.

## Cara dibangun

- **Aplikasi Mac**: Swift + AppKit dalam satu file sumber, token di Keychain, update otomatis yang ditandatangani (Ed25519). Isi dari password manager tidak pernah dikirim.
- **Server**: satu binary Go tanpa dependensi, hanya mendengarkan localhost di balik HTTPS. Clip disimpan **hanya di memori** (bawaan 20 item / 24 jam) dan hilang saat restart.
- **Keamanan**: kode pairing sekali pakai yang berlaku 5 menit, token per perangkat yang disimpan sebagai hash, batas percobaan login, cookie `HttpOnly` + `SameSite=Strict`, CSP ketat, dan gambar dicek dari isinya.

## Cuplikan

::gallery
---
fit: contain
images:
  - { src: /images/work/pastelan/phone-light.webp, alt: PasteLAN di HP (terang) }
  - { src: /images/work/pastelan/phone-dark.webp, alt: PasteLAN di HP (gelap) }
---
::

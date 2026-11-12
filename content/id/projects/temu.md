---
title: Temu
description: Versi pixel kecil dirimu (atau pet-mu) yang hidup di layar Mac orang terdekatmu — jalan-jalan di tepi bawah layar, ketiduran, joget, dan menyampaikan sapaanmu.
type: engineering
category: Aplikasi macOS · Web app
year: 2026
role: Full-stack Developer
company: Proyek pribadi
featured: false
order: 14
cover: /images/lab/temu.webp
technologies: [Swift, AppKit, Go, PostgreSQL, Vue 3, Vite, AI]
contribution:
  mine: Pengembang tunggal — konsep produk, aplikasi menu bar Swift, API Go dan worker generate, web Vue dan ruang admin, CI/CD, dan deploy.
links:
  - { label: Situs, url: "https://temu.katili.dev" }
  - { label: GitHub, url: https://github.com/kikiraihan/lite-mac-os-live-companion }
  - { label: Video teaser, url: /videos/temu-teaser.mp4 }
---

## Video teaser

::video-player{src="/videos/temu-teaser.mp4" poster="/images/lab/temu.webp" caption="A little way to be together: dari pet yang ketiduran di layar Mac sampai sapaan yang diantar pet teman." live="https://temu.katili.dev"}
::

## Apa yang dilakukan

*Temu* — bertemu, terhubung, menghadirkan diri. Temu menaruh versi pixel kecil dirimu di Mac pasangan, sahabat, atau keluarga: dia jalan-jalan di tepi bawah layar, ketiduran (lebih sering di malam hari), joget sendiri, bersin, mengejar kupu-kupu, dan kadang pulang membawa hadiah. Jauh, tapi rasanya tetap di sebelah.

- **Pet di desktop**: klik untuk mengelus, klik dua kali untuk melompat, seret untuk mengangkat lalu lepaskan (kalau tinggi, dia pusing). Ikonnya di menu bar ikut bergerak.
- **Tiga cara membuat dirimu yang kecil**: pilih salah satu dari lima pet bawaan, gambar sendiri di editor piksel 32×32 (16 pose), atau unggah foto dan biarkan AI menggambarmu — atau salin prompt-nya ke ChatGPT-mu sendiri lalu unggah hasilnya; server memotong, membuang latar, dan merapikannya jadi pixel art.
- **Teman dan sapaan**: undang lewat tautan atau nama pengguna. Begitu diizinkan, kamu ikut jalan-jalan di Mac-nya di samping pet miliknya, dan versi kecilmu yang menyampaikan pesanmu.
- **Ruang admin terpisah**: pengguna, pet, riwayat generate, jejak audit, koneksi provider AI dengan urutan cadangan (API key disimpan terenkripsi), jatah generate harian.

## Hanya kehadiran, bukan pengawasan

Aplikasi Mac-nya sengaja cuma mainan: tidak membaca layar, ketikan, clipboard, atau berkas, tidak meminta izin Aksesibilitas atau Perekaman Layar, dan tidak pernah memegang password — akun dihubungkan lewat kode perangkat dan hanya token perangkat yang disimpan di Keychain. Foto yang diunggah dihapus begitu pet-nya selesai digambar.

## Cara dibangun

- **Aplikasi Mac**: Swift + AppKit tanpa dependensi, macOS 13 ke atas, Apple Silicon dan Intel. Pet bawaan ditulis sebagai teks di kode sumber (satu karakter = satu piksel) lalu dirender jadi sprite sheet yang dipakai server.
- **Satu format pet di tiga tempat**: sprite sheet PNG 128×128, grid 4×4 pose 32×32, dengan urutan yang sama di server Go, web Vue, dan aplikasi Swift.
- **Server**: Go + PostgreSQL — API pengguna, API admin, API aplikasi Mac, dan worker generate; admin dan pengguna punya tabel, sesi, cookie, dan CSRF yang terpisah.
- **Web**: Vue 3 + Vite, dirancang sebagai sebuah desktop: bilah menu gelap di atas dan lantai di bawah tempat pet-mu benar-benar berjalan dan bisa diangkat, persis seperti di Mac.
- **Rilis**: menaikkan versi di `main` membuat build, paket, dan rilis Temu.zip + installer baru lewat runner macOS GitHub Actions.

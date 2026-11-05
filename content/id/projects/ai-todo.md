---
title: AI Todo
description: Aplikasi todo & pengingat yang bisa dikelola lewat chat dengan AI maupun manual — satu binary Go dengan SQLite, PWA yang bisa di-install, dan aplikasi menu bar macOS; AI hanya mengusulkan aksi, server yang memvalidasi.
type: engineering
category: Produk · Asisten AI
year: 2026
timeline: Okt 2026 — Nov 2026
role: Full-stack Developer
company: Proyek pribadi
featured: false
order: 11
cover: /images/work/ai-todo/todo.webp
technologies: [Go, SQLite, Vue 3, PWA, Web Push, Swift, AppKit, Docker]
metrics:
  - value: "3"
    label: provider AI gratis dengan fallback
  - value: "6"
    label: jenis jadwal pengingat
  - value: "1"
    label: binary + satu berkas SQLite
architecture:
  - id: clients
    label: PWA & aplikasi menu bar Mac
    detail: PWA Vue 3 untuk HP, tablet, dan PC (Web Push), plus aplikasi menu bar AppKit dengan badge, centang cepat, panel chat (⌥⌘T), dan notifikasi lokal.
  - id: api
    label: HTTP API Go
    detail: Cookie sesi (HttpOnly, Secure, SameSite=Strict), header CSRF wajib, batas percobaan login, CSP ketat. Setiap query dibatasi per pengguna.
  - id: assistant
    label: Asisten
    detail: Model mengembalikan rencana aksi JSON. Hanya operasi dalam whitelist yang diterima; hapus dan perubahan massal menunggu tombol konfirmasi, dan setiap batch bisa dibatalkan.
  - id: core
    label: Core
    detail: Validasi yang sama dengan form manual. AI tidak pernah menulis ke database secara langsung.
  - id: scheduler
    label: Penjadwal
    detail: Waktu pengingat dihitung server, bukan AI — sekali, harian, mingguan, bulanan, tahunan, atau tiap N menit dalam rentang jam.
  - id: ai
    label: Provider AI
    detail: Model gratis kenari, Agnes AI, dan OpenRouter dengan fallback sesuai urutan admin. Key hanya ada di environment server; host dibatasi allowlist.
contribution:
  mine: Pengembang tunggal — PRD, server Go, PWA Vue, aplikasi menu bar Swift, CI/CD, dan deploy.
links:
  - { label: GitHub, url: https://github.com/kikiraihan/mac-os-ai-todo }
  - { label: Video teaser, url: /videos/ai-todo-teaser.mp4 }
---

## Video teaser

::video-player{src="/videos/ai-todo-teaser.mp4" poster="/images/lab/ai-todo.webp" caption="Teaser AI Todo: chat, daftar todo, dan pengingat di PWA dan aplikasi menu bar Mac."}
::

## Masalah

Aplikasi todo memaksa kita mengisi form; asisten chat lupa apa yang kita ceritakan kemarin dan tidak bisa dipercaya menyentuh data. Saya ingin cukup mengetik *"besok jam 9 ingetin telpon bengkel, terus tandai beli galon udah"* dan semuanya terjadi — di HP dan di Mac — tanpa memberi AI kebebasan penuh atas database.

## Konteks

Alat pribadi yang dibuat supaya murah dijalankan di VPS sendiri: hanya model AI gratis, satu server kecil, dan notifikasi di semua perangkat yang saya pakai. Semua yang bisa dilakukan lewat chat juga harus bisa dilakukan manual, supaya aplikasi tetap berguna saat AI mati atau salah.

## Solusi

- **Chat sebagai jalan pintas**: tambah, ubah, selesaikan, hapus, cari, dan ringkas todo & pengingat dari satu kotak chat. Aksi tampil sebagai kartu dengan tombol **Batalkan**; hapus dan perubahan massal minta konfirmasi dulu. Perintah garis miring (`/todo`, `/hari-ini`, `/undo`) jalan tanpa AI sama sekali.
- **Manual tetap lengkap**: daftar todo dengan tab Hari ini / Akan datang / Tanpa tenggat / Selesai, pencarian, daftar, prioritas, catatan, dan pengingat sekali atau berulang dengan tanggal akhir, jumlah, tunda, dan jeda.
- **Asisten yang mengingat**: profil dan catatan (terinspirasi Hermes Agent) dibawa di setiap pesan dan bisa diperiksa, diubah, dan diekspor. Ingatan dipindai sebelum disimpan dan menolak password, PIN, token, nomor kartu, serta pola prompt injection.
- **Notifikasi di mana-mana**: Web Push untuk PWA, notifikasi native dengan tombol *Selesai* / *Tunda 10 mnt* di Mac, plus ringkasan pagi dan dorongan todo terlambat.
- **Mode admin terpisah**: katalog model AI (tes, aktifkan, urutan fallback), persona & batas asisten, AI call log, dan system log — tanpa satu pun endpoint yang bisa membaca todo, chat, atau ingatan pengguna lain.

## Arsitektur

::architecture-explorer{:nodes="architecture"}
::

## Tantangan teknis

- **Menjauhkan AI dari database.** Model hanya bisa mengusulkan rencana JSON. Server mencocokkan setiap operasi dengan whitelist, memvalidasi bentuknya, menjalankannya lewat fungsi core yang sama dengan form di dalam transaksi, dan mencatat entri undo.
- **Model gratis tidak bisa diandalkan.** Klien toleran terhadap balasan aneh, berpindah antar provider sesuai urutan, dan mencatat setiap panggilan keluar supaya admin bisa melihat model mana yang gagal dan kenapa.
- **Jadwal berulang gampang salah.** Penjadwal — bukan AI — menghitung setiap kemunculan berikutnya di zona waktu pengguna dan menyimpan waktu dalam UTC, dengan tes untuk rentang jam, akhir bulan, tanggal akhir, dan jumlah.
- **Aplikasi Mac tanpa Mac di CI.** Klien HTTP-nya hanya memakai Foundation, jadi diuji di Linux terhadap server Go asli; bagian AppKit dikompilasi dan dirilis oleh workflow GitHub Actions macOS.
- **Deploy yang tidak bisa merusak server.** Setiap merge ke `main` mem-backup database, membangun ulang container, menjalankan health check, dan rollback otomatis kalau gagal.

## Dampak

::metric-grid{:metrics="metrics"}
::

## Pelajaran

Perlakukan model bahasa sebagai pengguna dengan keyboard yang sangat cepat, bukan sebagai bagian dari backend: beri ia form yang sama dengan semua orang, buat aksi berbahaya butuh klik manusia, dan buat semuanya bisa dibatalkan. Satu aturan itu membuat sisa desainnya tetap sederhana.

## Cuplikan

::gallery
---
images:
  - { src: /images/work/ai-todo/chat.webp, alt: Chat asisten dengan kartu aksi dan tombol Batalkan }
  - { src: /images/work/ai-todo/todo-dark.webp, alt: Todo hari ini dalam mode gelap }
  - { src: /images/work/ai-todo/reminders-dark.webp, alt: Pengingat berulang yang dihitung server }
  - { src: /images/work/ai-todo/memory.webp, alt: Ingatan AI — profil dan catatan asisten }
---
::

![PWA di HP: asisten, todo (geser kanan untuk selesai, kiri untuk ubah atau hapus), dan pengingat](/images/work/ai-todo/phones.webp)

::gallery
---
fit: contain
images:
  - { src: /images/work/ai-todo/mac-todo.webp, alt: Aplikasi menu bar Mac — tab Todo, caption: "Aplikasi menu bar Mac, tab Todo: tambah cepat, Hari ini / Semua / Selesai, centang sekali klik. Ilustrasi berdasarkan tata letak AppKit aplikasinya." }
  - { src: /images/work/ai-todo/mac-chat-dark.webp, alt: Aplikasi menu bar Mac — tab Chat mode gelap, caption: "Tab Chat (⌥⌘T) dalam mode gelap: aksi tampil sebagai kartu dengan tombol Batalkan. Ilustrasi berdasarkan tata letak AppKit aplikasinya." }
---
::

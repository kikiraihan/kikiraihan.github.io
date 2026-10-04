---
title: Mengubah rencana konten 30 hari menjadi draf artikel dengan Claude Code
description: Cara saya mengganti rutinitas copy-paste antartab browser dengan satu slash command — API mungil berpengaman token, client bash, dan satu subagent per artikel supaya konteksnya tetap kecil.
date: 2026-10-03
original: en
tags: [Engineering, AI, Laravel, Claude Code]
cover: /images/writing/claude-code-content-plan/flow.svg
---

[katili.dev](https://katili.dev) — studio hosting dan pengembangan web milik saya — punya blog dua bahasa. Tiap bulan saya merencanakan sekitar 30 artikel di spreadsheet (judul, deskripsi, kategori, bahasa, tautan referensi, dan prompt siap pakai), mengimpornya ke panel admin Laravel, lalu mengerjakannya satu per satu, hari demi hari.

Bagian yang paling makan waktu adalah menghasilkan artikelnya — dan penyebabnya justru bukan proses menulis itu sendiri.

## Rutinitas copy-paste

Untuk setiap artikel, alurnya kurang lebih begini:

1. Buka project Claude yang instruksinya berisi panduan menulis saya (struktur, gaya bahasa, field SEO, dan format JSON persis yang dibutuhkan importer).
2. Kembali ke panel admin, cari hari yang dimaksud, klik **Copy Prompt**.
3. Pindah tab, buka chat baru di project tadi, tempel, lalu tunggu.
4. Salin jawaban JSON-nya, buka halaman impor, tempel, impor.
5. Kembali ke rencana, tandai hari itu selesai, lalu tautkan ke post yang baru.

Lima kali pindah konteks untuk satu artikel, tiga puluh artikel sebulan. Tidak ada yang sulit; semuanya cuma bikin repot. Saya ingin cukup mengetik satu perintah lalu kembali dan mendapati drafnya sudah jadi — **tanpa** memasang API key AI di server dan membayar per token, padahal saya sudah berlangganan dan memakainya setiap hari.

## Idenya: Claude Code yang mengemudi, server cukup jadi "pelayan"

Claude Code sudah berjalan di terminal saya, di dalam repositori. Ia bisa menjalankan perintah shell, mengambil halaman web, menulis file, dan menjalankan subagent dengan model pilihan. Jadi server tidak perlu *menghasilkan* apa-apa. Server cukup:

- memberi tahu Claude isi rencananya,
- memberikan prompt untuk satu item,
- menerima JSON yang sudah jadi lalu mengimpornya.

![Alurnya: Claude Code memanggil API kecil melalui script bash; satu subagent per artikel](/images/writing/claude-code-content-plan/flow.svg)

### 1. API kecil yang sengaja dibuat sederhana

Lima route di `routes/api.php`, di balik satu middleware yang mencocokkan Bearer token dengan environment variable memakai `hash_equals`. Tanpa Sanctum, tanpa tabel user — ini tool untuk dipakai satu orang saja.

| Endpoint | Kegunaan |
| --- | --- |
| `GET /api/content-plans` | daftar rencana beserta jumlah item selesai / sedang dikerjakan / belum |
| `GET /api/content-plans/{plan}/items` | daftar item **tanpa** prompt |
| `GET /api/content-plan-items/{item}` | satu item lengkap dengan prompt dan referensinya |
| `PATCH /api/content-plan-items/{item}` | mengubah status |
| `POST /api/content-plan-items/{item}/import` | mengimpor artikel yang sudah dihasilkan |

Ada dua keputusan yang lebih penting daripada route-nya sendiri:

- **Kalau token kosong, API mati** (403), bukan malah terbuka. Lupa mengisi env var jangan sampai membuat endpoint impor bisa diakses siapa saja.
- **Impor memakai ulang perintah `blog:import-json` yang sudah ada** — jalur kode yang sama dengan yang dipakai halaman admin. Endpoint menyimpan JSON di disk yang sama, menjalankan perintah itu, lalu membaca kembali ID post yang dibuatnya. Jadi tetap hanya ada satu pintu masuk artikel ke database, dan setiap post baru selalu masuk sebagai **draf**.

### 2. Client bash, bukan client yang canggih

`bin/content-plan` hanyalah bash dan `curl` — tanpa `jq`, tidak perlu menginstal apa pun:

```bash
bin/content-plan plans
bin/content-plan items 1          # apa yang masih harus dikerjakan
bin/content-plan show 42          # prompt lengkapnya
bin/content-plan check 42 a.json  # hanya validasi (dry run)
bin/content-plan import 42 a.json # post draf, item ditandai selesai
```

Script ini sama enaknya dipakai manual maupun oleh Claude — tanda bahwa interface-nya sudah pas.

### 3. Satu skill, satu subagent per artikel

Sebuah project skill (`.claude/skills/generate-blog/SKILL.md`) meringkas seluruh rutinitas tadi menjadi:

```text
/generate-blog 1 3,5,7-9 sonnet
```

Artinya: rencana 1, item 3, 5, 7, 8, dan 9, ditulis oleh Sonnet (default-nya Opus). Untuk setiap item, sesi utama menjalankan **satu subagent** dengan model yang dipilih. Subagent itu membaca panduan menulis langsung dari repositori, meminta prompt item tersebut ke API, mengambil tautan referensi, menulis JSON dua bahasa, memvalidasinya lewat dry run, membereskan apa pun yang ditolak server, lalu mengimpornya.

Setelah selesai, ia cukup membalas dengan satu baris:

```text
OK 42 | Apa Itu Harness dalam AI Agent? | #101 (id), #102 (en) · draft
```

## Mendesain demi hemat token, bukan sekadar fitur

Tantangan yang menarik di sini bukan soal fungsionalitas, melainkan ukuran konteks. Versi yang naif akan menjejalkan panduan 7,6 KB, tiga puluh prompt, belasan halaman web, dan semua artikel yang sudah jadi ke dalam satu percakapan. Di artikel kelima sesinya sudah lambat dan mahal; di artikel kesepuluh ia mulai lupa isi panduannya.

Ada tiga pilihan yang membuatnya tetap ramping:

- **Teks, bukan JSON, untuk apa pun yang dibaca model.** Setiap `GET` menerima `?format=text` dan mengembalikan tabel ringkas yang dipisah tanda pipa. JSON mengulang setiap key di setiap baris, dan model harus "membayar" setiap pengulangan itu.
- **Prompt hanya diambil saat dibutuhkan.** Daftar item tidak pernah menyertakan prompt. Hanya item yang sedang ditulis yang mengambil prompt-nya.
- **Subagent sebagai sekat konteks.** Panduan, referensi, dan artikelnya hanya ada di dalam konteks subagent, lalu hilang begitu ia selesai. Sesi utama hanya melihat satu tabel di awal dan satu baris hasil per artikel — jadi biaya artikel kesepuluh kurang lebih sama dengan artikel pertama.

## Supaya bisa jalan dari browser juga

Saya ingin perintah yang sama bisa dijalankan dari Claude Code versi web, supaya bisa memulai satu batch langsung dari ponsel. Sesi cloud punya tiga perbedaan dengan laptop saya: repositorinya hasil clone baru (file konfigurasi lokal saya tidak ikut), lalu lintas keluarnya melewati network policy, dan tidak ada orang yang menyetujui setiap perintah.

Urusan konfigurasi gampang — script sekarang membaca environment variable lebih dulu, baru file lokal, jadi token bisa disimpan di pengaturan environment cloud.

Urusan jaringannya yang lebih menarik. Waktu saya coba, proxy sesi menolak koneksi ke domain saya dengan **403**. Padahal API saya *juga* menjawab 403 saat dimatikan, dan 401 untuk token yang salah. Dari sisi script, "token kamu salah" dan "kamu tidak boleh keluar dari sandbox ini" kelihatan sama persis, padahal cara memperbaikinya jauh berbeda.

Solusinya cukup satu response header. Middleware menyisipkan `X-Content-Plan-Api: 1` di **setiap** response, termasuk 401 dan 403 miliknya sendiri. Script lalu memeriksanya:

- ada header → yang menjawab adalah API; exit code **1** beserta pesan dari API itu sendiri;
- tidak ada header → yang menjawab pihak lain (proxy, host yang salah, atau server yang belum men-deploy route-nya); exit code **2** dengan awalan `NETWORK:` dan petunjuk untuk mengizinkan domain tersebut.

Skill membaca exit code itu dan memberi tahu saya pengaturan mana persisnya yang perlu diubah — tanpa pernah meminta saya menempelkan token ke chat.

Dua pengaman kecil lainnya muncul dari pertanyaan yang sama: "bagaimana kalau ada dua 'saya' yang menjalankan ini bersamaan?"

- **Lock per item saat impor.** Sesi laptop dan sesi web (atau dua subagent yang jalan paralel) bisa sama-sama lolos pengecekan "apakah item ini sudah punya post?" sebelum salah satunya selesai. Sekarang impor memasang cache lock per item, membaca ulang item di dalam lock itu, dan membalas **423** ke pihak yang kalah. Item yang sudah punya post mendapat **409**, kecuali saya sengaja memaksa impor ulang.
- **Mode non-interaktif.** `/generate-blog next 2` mengambil dua item berikutnya yang belum selesai tanpa bertanya apa-apa, jadi bisa dijalankan secara terjadwal. Hasilnya tetap draf; keputusan untuk menerbitkan tetap di tangan manusia.

## Yang sengaja tidak saya buat

- **Tidak ada pemanggilan AI di server.** Server hanya menyimpan dan mengimpor; penulisannya terjadi di tool yang memang sudah saya bayar.
- **Tidak ada auto-publish.** Artikel yang dihasilkan berstatus draf. Saya tetap membaca, menyunting, dan menjadwalkan setiap artikel sendiri.
- **Tidak ada perubahan izin yang di-commit atas nama saya.** Allow-list yang memungkinkan sesi cloud berjalan tanpa diawasi hanya didokumentasikan, tidak di-commit — itu keputusan pemilik repositori, bukan agent yang menulis fiturnya.

## Hasilnya

Rutinitas yang tadinya lima kali pindah tab per artikel kini cukup satu baris untuk satu batch penuh:

```text
/generate-blog next 3
```

Beberapa menit kemudian, tiga draf dua bahasa sudah ada di panel admin, masing-masing tertaut ke harinya di kalender rencana konten, dengan JSON sumbernya tersimpan bersama hasil impor lainnya. Seluruh fitur ini kira-kira 550 baris PHP dan bash plus satu skill Markdown, dengan 14 feature test — dan sebagian besar pemikirannya justru tercurah pada apa yang *tidak* perlu dibaca model.

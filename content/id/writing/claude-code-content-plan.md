---
title: Mengubah rencana konten 30 hari menjadi draft artikel dengan Claude Code
description: Cara saya mengganti rutinitas copy-paste antartab browser dengan satu slash command — API kecil yang diproteksi token, client bash, dan satu subagent per artikel supaya context-nya tetap kecil.
date: 2026-10-03
original: en
tags: [Engineering, AI, Laravel, Claude Code]
cover: /images/writing/claude-code-content-plan/flow.svg
---

[katili.dev](https://katili.dev) — studio hosting dan web development milik saya — punya blog bilingual. Tiap bulan saya merencanakan sekitar 30 artikel di spreadsheet (judul, deskripsi, kategori, bahasa, link referensi, dan prompt siap pakai), meng-import-nya ke admin panel Laravel, lalu mengerjakannya satu per satu, hari demi hari.

Bagian yang paling makan waktu adalah menghasilkan artikelnya — dan penyebabnya justru bukan proses menulis itu sendiri.

## Rutinitas copy-paste

Untuk setiap artikel, alurnya kurang lebih begini:

1. Buka project Claude yang instruksinya berisi panduan menulis saya (struktur, gaya bahasa, field SEO, dan format JSON persis yang dibutuhkan importer saya).
2. Kembali ke admin panel, cari hari yang dimaksud, klik **Copy Prompt**.
3. Pindah tab, buka chat baru di project tadi, paste, lalu tunggu.
4. Copy response JSON-nya, buka halaman import, paste, import.
5. Kembali ke content plan, tandai hari itu selesai, lalu link ke post yang baru.

Lima kali context switch untuk satu artikel, tiga puluh artikel sebulan. Tidak ada yang sulit; semuanya cuma bikin repot. Saya ingin cukup mengetik satu perintah lalu kembali dan mendapati draft-nya sudah jadi — **tanpa** memasang API key AI di server dan membayar per token, padahal saya sudah berlangganan dan memakainya setiap hari.

## Idenya: Claude Code yang mengemudi, server cukup jadi "pelayan"

Claude Code sudah berjalan di terminal saya, di dalam repository. Ia bisa menjalankan shell command, fetch halaman web, menulis file, dan menjalankan subagent dengan model pilihan. Jadi server tidak perlu *menghasilkan* apa-apa. Server cukup:

- memberi tahu Claude isi content plan-nya,
- memberikan prompt untuk satu item,
- menerima JSON yang sudah jadi lalu meng-import-nya.

![Alurnya: Claude Code memanggil API kecil melalui script bash; satu subagent per artikel](/images/writing/claude-code-content-plan/flow.svg)

### 1. API kecil yang sengaja dibuat sederhana

Lima route di `routes/api.php`, di balik satu middleware yang mencocokkan Bearer token dengan environment variable memakai `hash_equals`. Tanpa Sanctum, tanpa tabel user — ini tool untuk single user.

| Endpoint | Kegunaan |
| --- | --- |
| `GET /api/content-plans` | daftar content plan beserta jumlah item selesai / sedang dikerjakan / belum |
| `GET /api/content-plans/{plan}/items` | daftar item **tanpa** prompt |
| `GET /api/content-plan-items/{item}` | satu item lengkap dengan prompt dan referensinya |
| `PATCH /api/content-plan-items/{item}` | mengubah status |
| `POST /api/content-plan-items/{item}/import` | meng-import artikel yang sudah di-generate |

Ada dua keputusan yang lebih penting daripada route-nya sendiri:

- **Kalau token kosong, API mati** (403), bukan malah terbuka. Lupa mengisi env var jangan sampai membuat endpoint import bisa diakses siapa saja.
- **Import memakai ulang command `blog:import-json` yang sudah ada** — code path yang sama dengan yang dipakai halaman admin. Endpoint menyimpan JSON di disk yang sama, menjalankan command itu, lalu membaca kembali ID post yang dibuatnya. Jadi tetap hanya ada satu pintu masuk artikel ke database, dan setiap post baru selalu masuk sebagai **draft**.

### 2. Client bash, bukan client yang canggih

`bin/content-plan` hanyalah bash dan `curl` — tanpa `jq`, tidak perlu install apa pun:

```bash
bin/content-plan plans
bin/content-plan items 1          # apa yang masih harus dikerjakan
bin/content-plan show 42          # prompt lengkapnya
bin/content-plan check 42 a.json  # hanya validasi (dry run)
bin/content-plan import 42 a.json # post draft, item ditandai selesai
```

Script ini sama enaknya dipakai manual maupun oleh Claude — tanda bahwa interface-nya sudah pas.

### 3. Satu skill, satu subagent per artikel

Sebuah project skill (`.claude/skills/generate-blog/SKILL.md`) meringkas seluruh rutinitas tadi menjadi:

```text
/generate-blog 1 3,5,7-9 sonnet
```

Artinya: content plan 1, item 3, 5, 7, 8, dan 9, ditulis oleh Sonnet (default-nya Opus). Untuk setiap item, main session menjalankan **satu subagent** dengan model yang dipilih. Subagent itu membaca panduan menulis langsung dari repository, meminta prompt item tersebut ke API, fetch link referensi, menulis JSON bilingual, memvalidasinya lewat dry run, membereskan apa pun yang ditolak server, lalu meng-import-nya.

Setelah selesai, ia cukup membalas dengan satu baris:

```text
OK 42 | Apa Itu Harness dalam AI Agent? | #101 (id), #102 (en) · draft
```

## Mendesain demi hemat token, bukan sekadar fitur

Tantangan yang menarik di sini bukan soal fungsionalitas, melainkan ukuran context. Versi yang naif akan menjejalkan panduan 7,6 KB, tiga puluh prompt, belasan halaman web, dan semua artikel yang sudah jadi ke dalam satu percakapan. Di artikel kelima session-nya sudah lambat dan mahal; di artikel kesepuluh ia mulai lupa isi panduannya.

Ada tiga pilihan yang membuatnya tetap ramping:

- **Teks, bukan JSON, untuk apa pun yang dibaca model.** Setiap `GET` menerima `?format=text` dan mengembalikan tabel ringkas yang pipe-delimited. JSON mengulang setiap key di setiap baris, dan model harus "membayar" setiap pengulangan itu.
- **Prompt hanya diambil saat dibutuhkan.** Daftar item tidak pernah menyertakan prompt. Hanya item yang sedang ditulis yang mengambil prompt-nya.
- **Subagent sebagai context firewall.** Panduan, referensi, dan artikelnya hanya ada di dalam context subagent, lalu hilang begitu ia selesai. Main session hanya melihat satu tabel di awal dan satu baris hasil per artikel — jadi biaya artikel kesepuluh kurang lebih sama dengan artikel pertama.

## Supaya bisa jalan dari browser juga

Saya ingin perintah yang sama bisa dijalankan dari Claude Code versi web, supaya bisa memulai satu batch langsung dari ponsel. Cloud session punya tiga perbedaan dengan laptop saya: repository-nya hasil fresh clone (file config lokal saya tidak ikut), outbound traffic-nya melewati network policy, dan tidak ada orang yang meng-approve setiap command.

Urusan config gampang — script sekarang membaca environment variable lebih dulu, baru file lokal, jadi token bisa disimpan di environment settings cloud.

Urusan network-nya yang lebih menarik. Waktu saya coba, proxy session menolak koneksi ke domain saya dengan **403**. Padahal API saya *juga* menjawab 403 saat dimatikan, dan 401 untuk token yang salah. Dari sisi script, "token kamu salah" dan "kamu tidak boleh keluar dari sandbox ini" kelihatan sama persis, padahal cara memperbaikinya jauh berbeda.

Solusinya cukup satu response header. Middleware menyisipkan `X-Content-Plan-Api: 1` di **setiap** response, termasuk 401 dan 403 miliknya sendiri. Script lalu memeriksanya:

- ada header → yang menjawab adalah API; exit code **1** beserta pesan dari API itu sendiri;
- tidak ada header → yang menjawab pihak lain (proxy, host yang salah, atau server yang belum men-deploy route-nya); exit code **2** dengan awalan `NETWORK:` dan petunjuk untuk mengizinkan domain tersebut.

Skill membaca exit code itu dan memberi tahu saya setting mana persisnya yang perlu diubah — tanpa pernah meminta saya paste token ke chat.

Dua safeguard kecil lainnya muncul dari pertanyaan yang sama: "bagaimana kalau ada dua 'saya' yang menjalankan ini bersamaan?"

- **Lock per item saat import.** Session di laptop dan session di web (atau dua subagent yang jalan paralel) bisa sama-sama lolos pengecekan "apakah item ini sudah punya post?" sebelum salah satunya selesai. Sekarang import memasang cache lock per item, membaca ulang item di dalam lock itu, dan membalas **423** ke pihak yang kalah. Item yang sudah punya post mendapat **409**, kecuali saya sengaja memaksa re-import.
- **Non-interactive mode.** `/generate-blog next 2` mengambil dua item berikutnya yang belum selesai tanpa bertanya apa-apa, jadi bisa dijalankan sebagai scheduled task. Hasilnya tetap draft; keputusan untuk publish tetap di tangan manusia.

## Yang sengaja tidak saya buat

- **Tidak ada AI call di server.** Server hanya menyimpan dan meng-import; penulisannya terjadi di tool yang memang sudah saya bayar.
- **Tidak ada auto-publish.** Artikel yang di-generate berstatus draft. Saya tetap membaca, mengedit, dan menjadwalkan setiap artikel sendiri.
- **Tidak ada perubahan permission yang di-commit atas nama saya.** Allow-list yang memungkinkan cloud session berjalan tanpa diawasi hanya didokumentasikan, tidak di-commit — itu keputusan pemilik repository, bukan agent yang menulis fiturnya.

## Hasilnya

Rutinitas yang tadinya lima kali pindah tab per artikel kini cukup satu baris untuk satu batch penuh:

```text
/generate-blog next 3
```

Beberapa menit kemudian, tiga draft bilingual sudah ada di admin panel, masing-masing ter-link ke harinya di kalender content plan, dengan source JSON-nya tersimpan bersama hasil import lainnya. Seluruh fitur ini kira-kira 550 baris PHP dan bash plus satu skill Markdown, dengan 14 feature test — dan sebagian besar pemikirannya justru tercurah pada apa yang *tidak* perlu dibaca model.

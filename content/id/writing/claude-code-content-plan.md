---
title: Mengubah rencana konten 30 hari menjadi draf artikel dengan Claude Code
description: Bagaimana saya mengganti siklus copy-paste antar tab browser dengan satu slash command — API kecil yang dilindungi token, client bash, dan satu subagent per artikel agar konteksnya tetap kecil.
date: 2026-10-03
original: en
tags: [Engineering, AI, Laravel, Claude Code]
cover: /images/writing/claude-code-content-plan/flow.svg
---

[katili.dev](https://katili.dev) — studio hosting dan pengembangan web saya — menjalankan blog dua bahasa. Setiap bulan saya merencanakan sekitar 30 artikel di spreadsheet (judul, deskripsi, kategori, bahasa, tautan referensi, dan prompt siap pakai), mengimpornya ke panel admin Laravel, lalu mengerjakannya hari demi hari.

Menulis artikelnya adalah bagian yang lambat, dan bukan karena proses menulisnya.

## Siklus copy-paste

Rutinitas untuk setiap artikel terlihat seperti ini:

1. Buka project Claude yang instruksinya berisi panduan menulis saya (struktur, gaya bahasa, field SEO, dan bentuk JSON persis yang diharapkan importer saya).
2. Kembali ke panel admin, cari harinya, tekan **Copy Prompt**.
3. Pindah tab, buka chat baru di project itu, tempel, tunggu.
4. Salin jawaban JSON, buka halaman impor, tempel, impor.
5. Kembali ke rencana dan tandai harinya selesai, lalu tautkan ke post yang baru.

Lima kali pindah konteks per artikel, tiga puluh artikel sebulan. Tidak ada yang sulit; semuanya adalah gesekan. Saya ingin cukup mengetik satu hal lalu kembali mendapati draf yang sudah jadi — **tanpa** menambahkan API key AI ke server dan membayar per token di atas langganan yang sudah saya pakai setiap hari.

## Idenya: biarkan Claude Code yang menyetir, server tetap "bodoh"

Claude Code sudah berjalan di terminal saya, di dalam repositori. Ia bisa menjalankan perintah shell, mengambil halaman web, menulis file, dan memulai subagent dengan model pilihan. Jadi server tidak perlu *menghasilkan* apa pun. Server hanya perlu:

- memberi tahu Claude apa saja isi rencananya,
- menyerahkan prompt satu item,
- menerima JSON yang sudah jadi lalu mengimpornya.

![Alurnya: Claude Code memanggil API kecil melalui script bash; satu subagent per artikel](/images/writing/claude-code-content-plan/flow.svg)

### 1. API kecil yang membosankan

Lima route di `routes/api.php`, di balik satu middleware yang membandingkan Bearer token dengan environment variable menggunakan `hash_equals`. Tanpa Sanctum, tanpa user — ini tool untuk satu orang.

| Endpoint | Kegunaan |
| --- | --- |
| `GET /api/content-plans` | daftar rencana dengan jumlah selesai / sedang dikerjakan / belum |
| `GET /api/content-plans/{plan}/items` | item **tanpa** prompt-nya |
| `GET /api/content-plan-items/{item}` | satu item dengan prompt dan referensi lengkap |
| `PATCH /api/content-plan-items/{item}` | ubah status |
| `POST /api/content-plan-items/{item}/import` | impor artikel yang dihasilkan |

Dua keputusan lebih penting daripada route-nya sendiri:

- **Token kosong mematikan API** (403), bukan membiarkannya terbuka. Lupa mengisi env var tidak boleh membuat endpoint impor terbuka untuk dunia.
- **Impor memakai ulang perintah `blog:import-json` yang sudah ada** — jalur kode yang sama dengan yang dipakai halaman admin. Endpoint menyimpan JSON di disk yang sama, memanggil perintah itu, lalu membaca kembali ID post yang ditulisnya. Tetap hanya ada satu jalan bagi artikel untuk masuk ke database, dan setiap post baru masuk sebagai **draf**.

### 2. Client bash, bukan client yang pintar

`bin/content-plan` hanyalah bash dan `curl` — tanpa `jq`, tidak ada yang perlu diinstal:

```bash
bin/content-plan plans
bin/content-plan items 1          # apa yang masih harus dikerjakan
bin/content-plan show 42          # prompt lengkapnya
bin/content-plan check 42 a.json  # hanya validasi (dry run)
bin/content-plan import 42 a.json # post draf, item ditandai selesai
```

Script ini sama bergunanya saat dipakai manual maupun oleh Claude — pertanda bagus bahwa interface-nya sudah tepat.

### 3. Sebuah skill, dan satu subagent per artikel

Sebuah project skill (`.claude/skills/generate-blog/SKILL.md`) mengubah seluruh siklus itu menjadi:

```text
/generate-blog 1 3,5,7-9 sonnet
```

Rencana 1, item 3, 5, 7, 8, dan 9, ditulis oleh Sonnet (default-nya Opus). Untuk setiap item, sesi utama memulai **satu subagent** dengan model yang dipilih. Subagent membaca panduan menulis langsung dari repositori, meminta prompt item itu ke API, mengambil tautan referensi, menulis JSON dua bahasa, memvalidasinya dengan dry run, memperbaiki apa pun yang dikeluhkan server, lalu mengimpornya.

Setelah itu ia menjawab dengan satu baris:

```text
OK 42 | Apa Itu Harness dalam AI Agent? | #101 (id), #102 (en) · draft
```

## Mendesain untuk token, bukan hanya untuk fitur

Batasan yang menarik bukanlah fungsionalitas — melainkan ukuran konteks. Versi naif akan menarik panduan 7,6 KB, tiga puluh prompt, belasan halaman web yang diambil, dan setiap artikel yang sudah jadi ke dalam satu percakapan. Di artikel kelima sesinya akan lambat dan mahal; di artikel kesepuluh ia mulai melupakan panduannya.

Tiga pilihan menjaganya tetap ramping:

- **Teks, bukan JSON, untuk apa pun yang dibaca model.** Setiap `GET` menerima `?format=text` dan mengembalikan tabel ringkas yang dipisahkan tanda pipa. JSON mengulang setiap key di setiap baris; model membayar setiap pengulangan itu.
- **Prompt hanya saat dibutuhkan.** Daftar item tidak pernah menyertakan prompt. Hanya item yang sedang ditulis yang mengambil prompt-nya.
- **Subagent sebagai firewall konteks.** Panduan, referensi, dan artikelnya sendiri hanya hidup di dalam konteks subagent dan hilang begitu ia selesai. Sesi utama hanya melihat sebuah tabel yang masuk dan satu baris per artikel yang keluar — jadi artikel kesepuluh biayanya kurang lebih sama dengan artikel pertama.

## Membuatnya bekerja dari browser juga

Saya ingin perintah yang sama bisa dijalankan dari Claude Code di web, supaya bisa memulai satu batch dari ponsel. Sesi cloud punya tiga perbedaan dari laptop saya: repositorinya adalah clone baru (file konfigurasi lokal saya tidak ada di sana), lalu lintas keluar melewati network policy, dan tidak ada orang yang menyetujui setiap perintah.

Konfigurasinya mudah — script sekarang membaca environment variable lebih dulu dan file lokal setelahnya, sehingga token bisa disimpan di pengaturan environment cloud.

Bagian jaringannya lebih menarik. Saat saya mencobanya, proxy sesi menolak koneksi ke domain saya dengan **403**. API saya *juga* menjawab 403 saat dimatikan, dan 401 untuk token yang salah. Dari sudut pandang script, "token kamu salah" dan "kamu tidak diizinkan keluar dari sandbox ini" terlihat sama, padahal cara memperbaikinya sama sekali berbeda.

Solusinya adalah satu response header. Middleware menempelkan `X-Content-Plan-Api: 1` di **setiap** response, termasuk 401 dan 403 miliknya sendiri. Script memeriksanya:

- header ada → API yang menjawab; exit code **1** dengan pesan dari API itu sendiri;
- header tidak ada → sesuatu yang lain yang menjawab (proxy, host yang salah, server yang belum men-deploy route-nya); exit code **2** dengan awalan `NETWORK:` dan petunjuk untuk mengizinkan domain tersebut.

Skill membaca exit code itu dan memberi tahu saya dengan tepat pengaturan mana yang perlu diubah — dan tidak pernah meminta saya menempelkan token ke chat.

Dua pengaman kecil lainnya lahir dari pertanyaan yang sama, "bagaimana kalau dua 'saya' menjalankan ini bersamaan?":

- **Lock per item saat impor.** Sesi laptop dan sesi web (atau dua subagent paralel) sama-sama bisa lolos pengecekan "apakah item ini sudah punya post?" sebelum salah satunya selesai. Impor sekarang mengambil cache lock per item, membaca ulang item di dalamnya, dan menjawab **423** kepada yang kalah. Item yang sudah punya post mendapat **409**, kecuali saya secara eksplisit memaksa impor ulang.
- **Mode non-interaktif.** `/generate-blog next 2` mengambil dua item berikutnya yang belum selesai tanpa bertanya apa pun, sehingga bisa dijalankan terjadwal. Hasilnya tetap draf; menerbitkan tetap menjadi keputusan manusia.

## Apa yang sengaja saya tinggalkan

- **Tidak ada panggilan AI di server.** Server menyimpan dan mengimpor; penulisannya terjadi di tool yang sudah saya bayar.
- **Tidak ada auto-publish.** Artikel yang dihasilkan berstatus draf. Saya tetap membaca, menyunting, dan menjadwalkan setiap artikel.
- **Tidak ada perubahan izin yang di-commit atas nama saya.** Allow-list yang memungkinkan sesi cloud berjalan tanpa diawasi didokumentasikan, bukan di-commit — itu keputusan pemilik repositori, bukan agent yang menulis fiturnya.

## Hasilnya

Rutinitasnya berubah dari lima kali pindah tab per artikel menjadi satu baris untuk satu batch penuh:

```text
/generate-blog next 3
```

Beberapa menit kemudian ada tiga draf dua bahasa di panel admin, tertaut ke harinya masing-masing di kalender rencana konten, dengan JSON sumbernya disimpan berdampingan dengan setiap impor lainnya. Seluruh fitur ini kira-kira 550 baris PHP dan bash ditambah satu skill Markdown, dicakup oleh 14 feature test — dan sebagian besar pemikirannya justru tercurah pada apa yang *tidak* perlu dibaca oleh model.

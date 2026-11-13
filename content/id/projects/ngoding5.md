---
title: Ngoding5
description: Situs latihan logika & syntax pemrograman berbahasa Indonesia, lima menit per soal — tulis fungsi lalu jalankan kasus uji, atau baca program dan tebak output persisnya.
type: engineering
category: Web app · Edukasi
year: 2026
role: Full-stack Developer
company: Proyek pribadi
featured: false
order: 15
cover: /images/lab/ngoding5.webp
technologies: [Vue 3, Vite, TypeScript, CodeMirror, Go, PostgreSQL, Redis, Docker]
contribution:
  mine: Pengembang tunggal — konsep produk, bank soal dan verifikasinya, frontend Vue, API Go dan runner sandbox, panel admin, deploy.
links:
  - { label: Situs, url: "https://ngoding5-static.vercel.app/" }
  - { label: GitHub (versi statis), url: https://github.com/kikiraihan/ngoding5-static }
  - { label: Video teaser, url: /videos/ngoding5-teaser.mp4 }
---

## Video teaser

::video-player{src="/videos/ngoding5-teaser.mp4" poster="/images/lab/ngoding5.webp" caption="Ngoding 5 menit, logika makin tajam: FizzBuzz yang salah urutan, petunjuk, semua kasus lolos, lalu jebakan sort() di JavaScript." live="https://ngoding5-static.vercel.app/"}
::

## Apa yang dilakukan

Ngoding5 adalah tempat mengasah logika dan syntax pemrograman dalam sesi singkat, gratis dan tanpa daftar.

- **Tulis kode**: tanda tangan fungsi bertipe jadi kerangka siap pakai di editor. Jalankan kasus contoh, bandingkan harapan dengan keluaran, buka petunjuk bertahap, lalu kumpulkan untuk diuji dengan kasus tersembunyi juga. Pembahasan dan solusi rujukan terbuka setelah lolos.
- **Tebak output**: baca program pendek lalu ketik (atau pilih) persis apa yang dicetak — jawabannya dari eksekusi nyata, termasuk jebakan khas tiap bahasa, seperti `sort()` pada angka di JavaScript.
- **Progres di perangkatmu**: soal tuntas, tebakan benar, hari beruntun, dan kalender aktivitas, tersimpan lokal dan bisa diekspor.

## Dua edisi

- **Versi statis** (live): tanpa server sama sekali. JavaScript jalan di Web Worker dan Python lewat Skulpt, langsung di peramban; 40 soal tulis kode dan 32 soal tebak output, diverifikasi dengan menjalankan solusi JS dan Python secara silang.
- **Versi lengkap** (yang tampil di video): setiap kode benar-benar dijalankan dalam enam bahasa — JavaScript, Python, PHP, Java, C++, dan Go — di container Docker sekali pakai tanpa jaringan, user non-root, rootfs read-only, serta batas CPU, memori, dan PID (gVisor di produksi). API Go hanya menaruh job di Redis Streams dan membandingkan hasilnya, jadi kasus tersembunyi tidak pernah sampai ke peramban; editor mengelola soal lewat panel admin dengan review, versi, dan "verifikasi semua bahasa" sebelum terbit.

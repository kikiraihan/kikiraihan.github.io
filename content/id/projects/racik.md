---
title: Racik
description: Editor desain ala Canva dengan AI — tulis ide, Claude menyusun seluruh desain sementara model gambar membuat visualnya, dan semuanya tetap bisa diedit, sampai ekspor PPTX dengan teks asli.
type: engineering
category: Web app · Alat desain AI
year: 2026
role: Full-stack Developer
company: Proyek pribadi
featured: false
order: 12
cover: /images/lab/racik.webp
technologies: [Vue 3, Nuxt, fabric.js, Go, PostgreSQL, Elasticsearch, Docker]
contribution:
  mine: Pengembang tunggal — product brief, editor Nuxt, API Go, konektor AI, panel admin, dan deploy.
links:
  - { label: Situs, url: "https://racik.katili.dev" }
  - { label: GitHub, url: "https://github.com/kikiraihan/racik" }
  - { label: Video teaser, url: "https://github.com/kikiraihan/racik/blob/main/video/racik-teaser.mp4" }
---

## Video teaser

::video-player{src="https://github.com/kikiraihan/racik/blob/main/video/racik-teaser.mp4" poster="/images/lab/racik.webp" caption="Dari satu kalimat prompt jadi desain multi halaman yang bisa diedit."}
::

## Apa yang dilakukan

Mahasiswa, desainer, dan tim marketing biasanya bolak-balik antara chatbot untuk teks, generator gambar terpisah, lalu Canva atau PowerPoint untuk menyusunnya. Racik menyatukannya: halaman pertama langsung kotak prompt, tanpa perlu daftar (akun tamu dibuat otomatis), dan satu klik kemudian desainnya terbuka di editor.

- **Magic Design**: prompt jadi desain multi halaman lengkap — layout, copy, palet, font, dan gambar AI. **Magic Redesign** menyusun ulang halaman aktif dari instruksi seperti *"lebih minimalis"*.
- **Editor sungguhan, bukan sekadar gambar**: teks, gambar, bentuk, ikon, layer (urutkan, kunci, sembunyikan), grup, perataan dengan smart guides, filter, undo/redo, Magic Resize, dan board yang menampilkan semua halaman berjajar.
- **Ekspor** ke PNG/JPG, PDF multi halaman, SVG, dan **PPTX dengan teks yang tetap bisa diedit**.
- **Makin paham selera**: beri nilai 👍/👎 plus catatan, atur Brand Kit (warna, font, logo, gaya bahasa), dan keduanya dipakai lagi di prompt berikutnya.

## Cara dibangun

- **Frontend**: SPA Nuxt 3 dengan kanvas fabric.js v6; "design spec" berbentuk JSON menjadi jembatan antara hasil AI, template, dan objek kanvas yang bisa diedit. Ekspor memakai `pptxgenjs`, `jspdf`, dan `jszip`.
- **Backend**: Go `net/http` murni (tanpa framework), PostgreSQL lewat `pgx` dengan migrasi saat start, JWT dan hashing password dari standard library.
- **AI**: Claude menyusun layout dan copy lewat gateway yang kompatibel dengan OpenAI; placeholder gambar dibuat paralel. Admin memilih model per fitur dari katalog model — pengunjung tidak pernah tahu provider di baliknya.
- **Saldo per pemakaian**: setiap panggilan AI dipotong di depan secara atomik dan dikembalikan otomatis bila vendor atau gambar gagal. Semua request AI dicatat, dengan system log di Elasticsearch.

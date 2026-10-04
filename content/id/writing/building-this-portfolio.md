---
title: Membangun ulang portofolio saya dengan Nuxt 4 dan Nuxt Content
description: Mengapa saya pindah dari tema Hugo ke Nuxt, dan bagaimana konten, gambar, dan animasi diatur sehingga menambah proyek cukup dengan satu file Markdown.
date: 2026-09-29
original: en
tags: [Engineering, Nuxt, Desain]
---

Situs lama saya adalah tema Hugo dengan Bootstrap, beberapa script inline, dan banyak `!important` untuk dark mode. Situs itu berfungsi, tapi menambah proyek berarti menyalin tabel gambar dalam Markdown sambil berharap layoutnya tetap rapi.

Tujuan pembangunan ulang ini: **konten terpisah dari tampilan**, dan sebuah situs yang dengan sendirinya menjadi salah satu karya portofolio.

## Konten adalah sumber kebenaran

Setiap proyek adalah satu file Markdown. Front-matter divalidasi dengan skema, jadi field yang hilang akan menggagalkan build alih-alih merusak halaman.

```ts
// content.config.ts
projects: defineCollection({
  type: 'page',
  source: 'projects/*.md',
  schema: z.object({
    category: z.string(),
    year: z.number(),
    role: z.string(),
    featured: z.boolean().default(false),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    cover: z.string(),
  }),
}),
```

Menambahkan `content/projects/my-project.md` otomatis membuat `/work/my-project` — tanpa mengubah komponen apa pun.

## Komponen di dalam Markdown

Studi kasus memakai beberapa komponen langsung dari Markdown, misalnya architecture explorer dan metrik yang beranimasi:

```md
::architecture-explorer{:nodes="architecture"}
::

::metric-grid{:metrics="metrics"}
::
```

## Animasi, tapi hanya saat membantu

Satu library animasi (GSAP), dimuat hanya di sisi klien. Animasi saat scroll dan counter menghormati `prefers-reduced-motion`; jika pengaturan itu aktif, semuanya langsung terlihat begitu saja.

## Statis secara default

Setiap halaman di-prerender, gambar dioptimalkan saat build, dan seluruh situs di-deploy ke GitHub Pages sebagai file statis.

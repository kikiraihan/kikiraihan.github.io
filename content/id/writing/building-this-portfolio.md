---
title: Membangun ulang portofolio saya dengan Nuxt 4 dan Nuxt Content
description: Kenapa saya pindah dari tema Hugo ke Nuxt, dan bagaimana konten, gambar, serta animasinya saya susun supaya menambah proyek cukup dengan satu file Markdown.
date: 2026-09-29
original: en
tags: [Engineering, Nuxt, Desain]
---

Situs lama saya memakai tema Hugo berbasis Bootstrap, ditambah beberapa script inline dan segudang `!important` demi dark mode. Situsnya jalan, tapi setiap kali menambah proyek saya harus menyalin tabel gambar di Markdown sambil berharap tata letaknya tidak berantakan.

Target pembangunan ulang ini: **konten terpisah dari tampilan**, dan situsnya sendiri bisa jadi salah satu karya di portofolio.

## Konten sebagai acuan utama

Setiap proyek cukup satu file Markdown. Front-matter-nya divalidasi dengan skema, jadi kalau ada field yang lupa diisi, build-nya yang gagal — bukan halamannya yang rusak.

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

Cukup tambahkan `content/projects/my-project.md`, halaman `/work/my-project` langsung tersedia — tanpa menyentuh satu komponen pun.

## Komponen langsung di Markdown

Studi kasus bisa memanggil komponen langsung dari Markdown, misalnya architecture explorer dan metrik beranimasi:

```md
::architecture-explorer{:nodes="architecture"}
::

::metric-grid{:metrics="metrics"}
::
```

## Animasi secukupnya, hanya kalau membantu

Cukup satu library animasi (GSAP), dan hanya dimuat di sisi klien. Animasi saat scroll dan counter mengikuti pengaturan `prefers-reduced-motion`; kalau pengaturan itu aktif, semua konten langsung tampil tanpa animasi.

## Statis sejak awal

Semua halaman di-prerender, gambar dioptimalkan saat build, lalu seluruh situs di-deploy ke GitHub Pages sebagai file statis.

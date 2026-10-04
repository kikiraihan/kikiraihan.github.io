---
title: Membangun ulang portofolio saya dengan Nuxt 4 dan Nuxt Content
description: Kenapa saya pindah dari tema Hugo ke Nuxt, dan bagaimana content, image, serta animasinya saya susun supaya menambah project cukup dengan satu file Markdown.
date: 2026-09-29
original: en
tags: [Engineering, Nuxt, Desain]
---

Situs lama saya memakai tema Hugo berbasis Bootstrap, ditambah beberapa inline script dan segudang `!important` demi dark mode. Situsnya jalan, tapi setiap kali menambah project saya harus meng-copy tabel gambar di Markdown sambil berharap layout-nya tidak berantakan.

Target rebuild ini: **content terpisah dari presentation**, dan situsnya sendiri bisa jadi salah satu karya di portofolio.

## Content sebagai source of truth

Setiap project cukup satu file Markdown. Front-matter-nya divalidasi dengan schema, jadi kalau ada field yang lupa diisi, build-nya yang gagal — bukan halamannya yang rusak.

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

Cukup tambahkan `content/projects/my-project.md`, halaman `/work/my-project` langsung tersedia — tanpa menyentuh satu component pun.

## Component langsung di Markdown

Case study bisa memanggil component langsung dari Markdown, misalnya architecture explorer dan animated metrics:

```md
::architecture-explorer{:nodes="architecture"}
::

::metric-grid{:metrics="metrics"}
::
```

## Animasi secukupnya, hanya kalau membantu

Cukup satu animation library (GSAP), dan hanya di-load di client-side. Scroll animation dan counter mengikuti setting `prefers-reduced-motion`; kalau setting itu aktif, semua konten langsung tampil tanpa animasi.

## Static by default

Semua halaman di-prerender, image dioptimasi saat build, lalu seluruh situs di-deploy ke GitHub Pages sebagai static file.

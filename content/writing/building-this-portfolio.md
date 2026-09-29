---
title: Rebuilding my portfolio with Nuxt 4 and Nuxt Content
description: Why I moved from a Hugo theme to Nuxt, and how content, images and motion are organised so adding a project is one Markdown file.
date: 2026-09-29
tags: [Engineering, Nuxt, Design]
---

My old site was a Hugo theme with Bootstrap, a few inline scripts and a lot of `!important` for dark mode. It worked, but adding a project meant copying Markdown tables of images and hoping the layout held.

The goal of the rebuild: **content separated from presentation**, and a site that is itself a portfolio piece.

## Content is the source of truth

Every project is one Markdown file. Front-matter is validated with a schema, so a missing field fails the build instead of breaking a page.

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

Adding `content/projects/my-project.md` creates `/work/my-project` — no component changes.

## Components inside Markdown

Case studies use a few components directly from Markdown, for example an architecture explorer and animated metrics:

```md
::architecture-explorer{:nodes="architecture"}
::

::metric-grid{:metrics="metrics"}
::
```

## Motion, but only when it helps

One animation library (GSAP), loaded on the client only. Scroll reveals and counters respect `prefers-reduced-motion`; when it is set, everything is simply visible.

## Static by default

Every page is prerendered, images are optimised at build time, and the whole site deploys to GitHub Pages as static files.

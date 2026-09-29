# Kiki — Portfolio (Nuxt 4)

Revamp of [kikiraihan.github.io](https://kikiraihan.github.io) (previously Hugo + Bootstrap), following [`prd.md`](./prd.md).

**Stack:** Nuxt 4 · Vue 3 · TypeScript · Nuxt Content 3 · Tailwind CSS 4 · Nuxt Image · Nuxt Icon · GSAP (lazy-loaded) — fully prerendered static site.

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # static output in .output/public
npm run lint && npm run typecheck
```

## Structure

```text
app/
├── app.config.ts          # profile, nav, socials, skills, typed words, Crisp id  ← edit here
├── assets/css/main.css    # Tailwind + design tokens (colors, fonts, type scale, motion)
├── assets/css/themes/     # one CSS file per theme (editorial, retro) — see CLAUDE.md → Theming
├── theme.config.ts        # active theme (hardcoded)  ← switch themes here
├── components/
│   ├── base/              # AppButton, SectionHeading, TagList
│   ├── layout/            # SiteHeader, SiteFooter, ThemeToggle, ImageLightbox, AskChat
│   ├── home/              # HomeHero, SelectedWork, AboutPreview, ContactCta
│   ├── work/              # ProjectCard, ExperienceTimeline, CapabilityGrid
│   └── content/           # usable inside Markdown: Gallery, MetricGrid, ArchitectureExplorer, ProseImg
├── composables/           # useColorScheme, useLightbox, useTypewriter, usePageSeo, useContentQueries
├── plugins/motion.ts      # v-reveal (scroll reveal) and v-magnetic directives
├── utils/                 # motion (lazy GSAP), content helpers (reading time, dates)
├── layouts/ pages/ error.vue
content/
├── projects/*.md          # → /work/[slug]   (engineering + design, `type` field)
├── writing/*.md           # → /writing/[slug]
├── pages/about.md         # copy for /about
└── data/                  # experience.yml, lab.yml
public/
├── images/profile/        # portrait, avatar
├── images/work/<slug>/    # one folder per project, same name as the Markdown file
├── images/writing/<slug>/
├── og.png, favicon.ico, resume.pdf, .nojekyll
server/routes/             # sitemap.xml, robots.txt (prerendered)
content.config.ts          # content schemas (validated front-matter)
```

Components use flat names (`<ProjectCard>`); folders are only for organisation.

## Adding content

**Project** — create `content/projects/my-project.md` and put images in `public/images/work/my-project/`:

```md
---
title: My Project
description: One sentence about the problem and result.
type: engineering          # or: design
category: Backend · Payments
year: 2025
role: Software Engineer
company: Company / context
featured: true             # show on the home page (aim for 4–6)
order: 1                   # sort order
cover: /images/work/my-project/cover.png
technologies: [Laravel, PostgreSQL]
metrics:                   # only public, verified numbers
  - { value: "20+", label: API modules }
architecture:              # optional, for the architecture explorer
  - { id: api, label: API, detail: What it does }
contribution:
  team: What the team built.
  mine: What I built.
links:
  - { label: Live site, url: https://… }
draft: false               # true = hidden everywhere
---

## Problem
## Context
## Solution
## Architecture
::architecture-explorer{:nodes="architecture"}
::
## Technical challenges
## Impact
::metric-grid{:metrics="metrics"}
::
## Lessons learned

::gallery
---
images:
  - { src: /images/work/my-project/1.png, alt: Caption }
---
::
```

Plain Markdown images `![alt](/images/…)` are optimised and open in the lightbox automatically.

**Article** — `content/writing/slug.md` with `title`, `description`, `date`, `tags`, optional `cover` and `lang: id` for Indonesian posts. Reading time and related articles (by shared tags) are computed.

**Experience / Lab** — edit `content/data/experience.yml` and `content/data/lab.yml`.

## Features carried over from the old site

| Old (Hugo) | New |
| --- | --- |
| Typed.js "I make …" | `useTypewriter` (no dependency; static when reduced motion) |
| `darkmode.js` + many `!important` overrides | `.dark` class + CSS tokens; same `localStorage("color-scheme")` key, no flash on load |
| Click image → `#previewContainer` | `ImageLightbox` (native `<dialog>`: Esc, focus trap) |
| Crisp chat on every page | "Ask something" button — Crisp loads only when clicked |
| `/projects`, `/design`, `/resume`, `/blogs` | Redirects to `/work`, `/work?type=design`, `/about`, `/writing` |
| Google Translate widget | Removed (was mostly disabled) |

## Motion & accessibility

- Hero intro is CSS-only (runs before hydration, never hides the LCP element).
- Scroll reveals, counters, parallax and magnetic buttons use GSAP, imported lazily.
- `prefers-reduced-motion` disables all of it; content is visible without JS.
- Skip link, visible focus rings, `aria-current`/`aria-pressed`/`aria-expanded`, keyboard-operable timeline and architecture explorer.

## SEO

`usePageSeo()` sets a unique title, description, canonical URL, Open Graph/Twitter card and JSON-LD (`Person`, `WebSite`, `CreativeWork`, `Article`) per page. `/sitemap.xml` and `/robots.txt` are generated from content. Set `NUXT_PUBLIC_SITE_URL` for another domain.

## Deployment

`npm run generate` produces a static site in `.output/public` (GitHub Pages compatible: `.nojekyll`, extensionless `.html` routes). The CI workflow lints, typechecks and builds on every push/PR; deployment to GitHub Pages is a manual `workflow_dispatch` with `deploy: true`.

The site assumes it is served from the domain root (e.g. `kikiraihan.github.io` or a custom domain). To replace the old site, either push this build to the `kikiraihan.github.io` repository or point a custom domain at this repository's Pages.

## Before launch

- Review `content/projects/payment-gateway.md` (currently `draft: true`) — every metric must be public and verified (PRD §25).
- Review all metrics and team/individual contribution text.
- Add “Personal interests” to `content/pages/about.md`.

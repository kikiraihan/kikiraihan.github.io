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
├── app.config.ts          # profile, nav, socials, skills, typed words, chat (WhatsApp/Crisp)  ← edit here
│                          #   visitor-facing text as { en: '…', id: '…' }
├── assets/css/main.css    # Tailwind + design tokens (colors, fonts, type scale, motion)
├── assets/css/themes/     # one CSS file per theme (editorial, retro, minimal) — see CLAUDE.md → Theming
├── theme.config.ts        # active theme (hardcoded)  ← switch themes here
├── components/
│   ├── base/              # AppButton, SectionHeading, TagList
│   ├── layout/            # SiteHeader, SiteFooter, ThemeToggle, LanguageSwitch, ImageLightbox, AskChat
│   ├── home/              # HomeHero, SelectedWork, AboutPreview, ContactCta
│   ├── work/              # ProjectCard, ExperienceTimeline, CapabilityGrid
│   └── content/           # usable inside Markdown: Gallery, MetricGrid, ArchitectureExplorer, ProseImg,
│                          #   ColorPalette, SymbolExplorer, ProcessSteps (design case studies), ProseA
├── composables/           # useColorScheme, useLightbox, useTypewriter, usePageSeo, useContentQueries, useSiteConfig
├── plugins/motion.ts      # v-reveal (scroll reveal) and v-magnetic directives
├── utils/                 # motion (lazy GSAP), content helpers (reading time, dates)
├── layouts/ pages/ error.vue
content/
├── en/                    # English (site root: /work, /writing, …)
│   ├── projects/*.md      # → /work/[slug]   (engineering + design, `type` field)
│   ├── writing/*.md       # → /writing/[slug]
│   ├── pages/about.md     # copy for /about
│   └── data/              # experience.yml, lab.yml
└── id/                    # Indonesian (/id/work, /id/writing, …) — same file names as en/
i18n/locales/              # en.json, id.json — interface text (buttons, headings, labels)
public/
├── images/profile/        # portrait, avatar
├── images/work/<slug>/    # one folder per project, same name as the Markdown file
├── images/writing/<slug>/
├── og.png, favicon.ico, .nojekyll
server/routes/             # sitemap.xml, robots.txt (prerendered)
content.config.ts          # content schemas (validated front-matter)
```

Components use flat names (`<ProjectCard>`); folders are only for organisation.

## Languages (English / Indonesian)

The site is bilingual with [`@nuxtjs/i18n`](https://i18n.nuxtjs.org): English at the root (`/work`), Indonesian under `/id`
(`/id/work`). The **EN / ID** switch in the header links to the same page in the other language.

- **Interface text** (buttons, headings, labels) — `i18n/locales/en.json` and `id.json`, used as `$t('key')`.
- **Profile, nav, skills, chat message** — `app/app.config.ts`, written as `{ en: '…', id: '…' }`; components read it through `useSiteConfig()`.
- **Content** — the same file name in `content/en/…` and `content/id/…`. A page without an Indonesian file falls back to
  English (and an article that exists only in Indonesian still opens on the English site, with a note).
- Links between pages in Markdown use the English path (`/work/kongkong`); `ProseA` points them to `/id/…` on the Indonesian site.
- An article that is a translation can say where it came from with `original: id` (or `en`) — a small "translated from" note is shown.
- Keep the non-text front-matter (type, year, order, featured, cover, technologies, date) identical in both languages, and
  write metric numbers with a comma as the thousands separator in both (`"7,394"`; shown as 7.394 in Indonesian).

## Adding content

**Project** — create `content/en/projects/my-project.md` (and its translation in `content/id/projects/`) and put images in `public/images/work/my-project/`:

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

Plain Markdown images `![alt](/images/…)` are optimised and open in the lightbox automatically
(`.svg` diagrams are served as-is, not rasterised).

**Design case studies** have extra blocks for breaking a piece down (see `content/en/projects/genbi-branding.md`):

```md
::process-steps
---
steps:
  - { title: Words first, text: "What happened in this step." }
---
::

::color-palette
---
colors:
  - { hex: "#184E78", name: Navy, role: Symbols and headings }   # click a swatch to copy the hex
---
::

::symbol-explorer
---
items:
  - { src: /images/work/my-project/symbols/a.png, label: Name, meaning: What it stands for. }
---
::

::gallery
---
fit: contain        # show the whole image (logos, crops); small crops are never upscaled
cols: 3             # optional, default 2
images:
  - { src: /images/work/my-project/detail.png, alt: Hover label, caption: Always-visible caption. }
---
::
```

Quote YAML values that contain a comma or a colon (`text: "A, B: C"`), otherwise the flow mapping splits them.

**Show / hide engineering or design work** — `work.engineering` / `work.design` in `app/app.config.ts` (both `true` by default).
A kind switched off disappears from the Work page (its filter button too), home "Selected work", its case-study pages
(not generated) and the sitemap; links to those projects from Markdown, the experience timeline and the Lab render as plain text.

**Article** — `content/en/writing/slug.md` and/or `content/id/writing/slug.md` with `title`, `description`, `date`, `tags`, optional `cover`, and `original: en|id` on the translated copy. Reading time and related articles (by shared tags) are computed.
Add `lab: true` for a lab note / experiment: it keeps its `/writing/<slug>` page but is left out of the Writing list
(and related articles) — link it from `content/<locale>/data/lab.yml` with `url: /writing/<slug>`.

**Experience / Lab** — edit `content/<en|id>/data/experience.yml` and `content/<en|id>/data/lab.yml`.

## Features carried over from the old site

| Old (Hugo) | New |
| --- | --- |
| Typed.js "I make …" | `useTypewriter` (no dependency; static when reduced motion) |
| `darkmode.js` + many `!important` overrides | `.dark` class + CSS tokens; same `localStorage("color-scheme")` key, no flash on load |
| Click image → `#previewContainer` | `ImageLightbox` (native `<dialog>`: Esc, focus trap) |
| Crisp chat on every page | "Ask something": WhatsApp button by default, or Crisp (loaded when idle) via `askChat.provider` |
| `/projects`, `/design`, `/resume`, `/blogs` | Redirects to `/work`, `/work?type=design`, `/about`, `/writing` |
| Google Translate widget | Real English / Indonesian versions of every page (`/id/…`) |

## Motion & accessibility

- Hero intro is CSS-only (runs before hydration, never hides the LCP element).
- Scroll reveals, counters, parallax and magnetic buttons use GSAP, imported lazily.
- `prefers-reduced-motion` disables all of it; content is visible without JS.
- Skip link, visible focus rings, `aria-current`/`aria-pressed`/`aria-expanded`, keyboard-operable timeline and architecture explorer.

## SEO

`usePageSeo()` sets a unique title, description, canonical URL, Open Graph/Twitter card and JSON-LD (`Person`, `WebSite`, `CreativeWork`, `Article`) per page. `/sitemap.xml` (both languages, with hreflang alternates) and `/robots.txt` are generated from content; every page carries `hreflang` alternate links and the right `<html lang>`. Set `NUXT_PUBLIC_SITE_URL` for another domain.

## Deployment

`npm run generate` produces a static site in `.output/public` (GitHub Pages compatible: `.nojekyll`, extensionless `.html` routes). The CI workflow lints, typechecks and builds on every push/PR; every push to `main` is deployed to GitHub Pages (a manual `workflow_dispatch` with `deploy: true` also deploys). Settings → Pages → Source must be "GitHub Actions".

The site assumes it is served from the domain root (e.g. `kikiraihan.github.io` or a custom domain). To replace the old site, either push this build to the `kikiraihan.github.io` repository or point a custom domain at this repository's Pages.

## Before launch

- Review `content/en/projects/payment-gateway.md` (currently `draft: true`) — every metric must be public and verified (PRD §25).
- Review all metrics and team/individual contribution text.
- Add “Personal interests” to `content/en/pages/about.md` and `content/id/pages/about.md`.

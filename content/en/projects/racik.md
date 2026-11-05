---
title: Racik
description: A Canva-style design editor with AI — write an idea and Claude lays out the whole design while an image model makes the visuals, and everything stays editable, down to PPTX export with real text.
type: engineering
category: Web app · AI design tool
year: 2026
role: Full-stack Developer
company: Personal project
featured: false
order: 12
cover: /images/lab/racik.webp
technologies: [Vue 3, Nuxt, fabric.js, Go, PostgreSQL, Elasticsearch, Docker]
contribution:
  mine: Sole developer — product brief, Nuxt editor, Go API, AI connectors, admin panel and deployment.
links:
  - { label: Live site, url: "https://racik.katili.dev" }
  - { label: GitHub, url: "https://github.com/kikiraihan/racik" }
  - { label: Teaser video, url: "https://github.com/kikiraihan/racik/blob/main/video/racik-teaser.mp4" }
---

## Teaser video

::video-player{src="https://github.com/kikiraihan/racik/blob/main/video/racik-teaser.mp4" poster="/images/lab/racik.webp" caption="From a one-line prompt to an editable multi-page design." live="https://racik.katili.dev"}
::

## What it does

Students, designers and marketing teams usually bounce between a chatbot for the copy, a separate image generator for the visuals and Canva or PowerPoint to put it all together. Racik does it in one place: the first page is a prompt box, no sign-up needed (a guest account is created automatically), and one click later the design opens in the editor.

- **Magic Design**: a prompt becomes a complete multi-page design — layout, copy, palette, fonts and AI-generated images. **Magic Redesign** reworks the active page from an instruction such as *"more minimal"*.
- **A real editor, not a picture**: text, images, shapes, icons, layers (reorder, lock, hide), groups, alignment with smart guides, filters, undo/redo, Magic Resize and a board that shows every page side by side.
- **Export** to PNG/JPG, multi-page PDF, SVG and **PPTX with editable text**.
- **It learns your taste**: rate results with 👍/👎 and a note, set a Brand Kit (colors, fonts, logo, tone), and both are fed back into the next prompt.

## How it's built

- **Frontend**: Nuxt 3 SPA with a fabric.js v6 canvas; a JSON "design spec" is the bridge between AI output, templates and editable canvas objects. Export uses `pptxgenjs`, `jspdf` and `jszip`.
- **Backend**: plain Go `net/http` (no framework), PostgreSQL via `pgx` with migrations on start, JWT and password hashing from the standard library.
- **AI**: Claude writes the layout and copy through an OpenAI-compatible gateway; image placeholders are generated in parallel. Admins pick the models per feature from a model catalog — visitors never see which provider is behind it.
- **Usage-based balance**: every AI call is charged up front atomically and refunded automatically when a vendor or an image fails. All AI requests are logged, with a system log in Elasticsearch.

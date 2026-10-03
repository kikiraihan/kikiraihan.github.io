# CLAUDE.md

Personal portfolio of Moh. Zulkifli Katili ("Kiki"). Nuxt 4 · Vue 3 · TypeScript · Nuxt Content 3 ·
Tailwind CSS 4 · Nuxt Image · Nuxt Icon · GSAP (lazy-loaded). Fully prerendered static site, deployed
to GitHub Pages. See `README.md` for structure and how to add content, `prd.md` for the product spec.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # eslint (stylistic rules off)
npm run typecheck  # nuxt typecheck (vue-tsc)
npm run generate   # static build → .output/public (this is what CI deploys)
```

CI (`.github/workflows/ci.yml`) runs `npm ci`, lint, typecheck and generate — run the same before pushing.
Keep `package-lock.json` in sync when adding dependencies (`npm ci` fails otherwise).

## Conventions

- Site data (profile, nav, socials, chat provider, Crisp id) lives in `app/app.config.ts`, not in components.
- Components use flat names (`<ProjectCard>`); folders under `app/components/` are only for organisation.
- Fonts are self-hosted via `@fontsource*` packages — no third-party font/CDN requests.
- Colors are always token utilities (`bg-paper`, `text-ink-2`, `border-line`, `text-accent`, …), never raw hex
  in templates, so light/dark and themes only swap variable values.
- Dark mode is class-based (`.dark` on `<html>`, see `useColorScheme` + the head script in `nuxt.config.ts`).
- Keep existing comments when editing code.

## Theming

The whole look of the site is a **theme**, chosen by one hardcoded value:

```ts
// app/theme.config.ts
export const themes = ['editorial', 'retro', 'minimal', 'apple-web-2'] as const
export const activeTheme: ThemeName = 'apple-web-2'   // ← change this and rebuild
```

| Theme       | Look                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------- |
| `editorial` | The original design: Instrument Serif headlines, soft paper colors, rounded pill buttons. |
| `retro`     | Old-school video game: Press Start 2P pixel font, square corners, hard offset shadows, pixel grid background, CRT scanlines, blinking cursors. |
| `minimal`   | Clean Apple-like UI à la mobbin.com: white / true-black canvas, Inter semibold headlines with tight tracking, gray pill buttons and chips, large radii, frosted header. |
| `apple-web-2` | Compact designer-portfolio "sheet" (current): the whole site is a white rounded sheet on a gray canvas, small dense Inter type, modest semibold headlines, hairline-bordered cards, small black/white pill buttons, orange accent, green contribution graph. |

### How it works

1. `nuxt.config.ts` imports `activeTheme` and renders `<html data-theme="<name>">` (via `app.head.htmlAttrs`),
   so the theme is in the prerendered HTML — no flash, no JS needed, and it also applies to `error.vue`.
2. `app/assets/css/main.css` holds the **shared defaults**: color tokens (`:root` / `.dark`), the Tailwind
   `@theme` (fonts, type scale, radius…), base styles, `.container-page`, prose, motion. These defaults are
   the editorial values.
3. Each theme is one file, `app/assets/css/themes/<name>.css`, imported from `main.css`. Every rule in it is
   scoped to `html[data-theme="<name>"]`, so only the active theme's rules match. A theme can:
   - **override tokens** — color variables (`--paper`, `--ink`, `--ink-2`, `--ink-3`, `--line`, `--accent`,
     `--accent-ink`, `--accent-2`, `--shadow`) and Tailwind theme variables (`--font-serif`,
     `--text-display*`, `--text-headline*`, `--radius-*`). Tailwind utilities read these through `var()`,
     so e.g. `font-serif text-display` everywhere becomes the pixel font at pixel-friendly sizes.
     Dark values go in `html[data-theme="<name>"].dark` (the plain `.dark` rule has lower specificity).
   - **fill in theme hooks** — the semantic classes below.
   - add theme-only base styles (retro's grid background and scanlines) and `@font-face` rules.
4. `useTheme()` (`app/composables/useTheme.ts`) returns `{ theme, isTheme(name) }` for the rare case where
   a theme needs different **markup**. Prefer CSS hooks; use `v-if="isTheme('retro')"` only when CSS
   can't do it.

### Theme hooks

Components carry layout utilities (spacing, flex, position) plus these semantic classes; everything
theme-specific (shape, border, shadow, font, colors, markers) is defined per theme:

| Hook                                  | Used in                  | What the theme defines                                  |
| ------------------------------------- | ------------------------ | ------------------------------------------------------- |
| `.eyebrow`                            | everywhere (small labels)| font, size, tracking (base: `uppercase text-ink-3`)      |
| `.btn` + `.btn-solid/-outline/-ghost` | `AppButton`              | shape, font, colors, hover/active                        |
| `.tag`                                | `TagList`                | pill vs square chip                                      |
| `.card-frame`                         | `ProjectCard` cover      | radius/border/shadow, hover                              |
| `.portrait-frame`                     | `HomeHero` portrait      | radius/border/shadow                                     |
| `.metric-badge`                       | `ProjectCard` metric     | background, border                                       |
| `.site-header`                        | `SiteHeader`             | bottom border, background                                |
| `.nav-link` (+ `[aria-current=page]`) | `SiteHeader` desktop nav | font; active marker via `::before`/`::after` (dot / ▶)   |
| `.status-dot`                         | `HomeHero` eyebrow dot   | shape + animation (pulse / blink)                        |
| `.prompt`, `.cursor`                  | `HomeHero` typewriter    | prefix (`> `) and cursor glyph (`_` / `█`) via pseudo-elements |
| `.ask-btn`                            | `AskChat` button         | shape, font, border, shadow                              |
| `.site-shell`                         | `layouts/default.vue` root | page frame (full-bleed, or apple-web-2's floating sheet) |
| `.contrib-cell` (+ `[data-level]` 0–4) | `GitHubContributions`   | cell shape and the 5-step color ramp                     |

**Every theme must define every hook** — a missing hook means that element renders unstyled
(e.g. a button with no background) in that theme.

### Adding a theme

1. Add the name to `themes` in `app/theme.config.ts`.
2. Create `app/assets/css/themes/<name>.css` (copy `editorial.css` as a starting point) and `@import` it in
   `main.css` next to the others.
3. Scope every rule to `html[data-theme="<name>"]`; put hook rules in `@layer components` so utilities in
   templates can still override them.
4. Override tokens as needed; for a new font, add its `@fontsource` package (self-hosted) and an
   `@font-face`/`@import` in the theme file.
5. Set `activeTheme`, then check both light and dark mode and a phone-width viewport (no horizontal
   overflow — large display fonts are the usual culprit) with `npm run generate`.

### Adding a component that should look different per theme

Add a new semantic hook class to the component, define it in **every** theme file, and add a row to the
table above.

### Retro theme notes

- The pixel font is declared with `size-adjust: 70%` in `themes/retro.css` (its glyphs are ~1em wide), so the
  normal `text-*` sizes stay usable; display/headline sizes are also reduced via tokens.
- `font-synthesis: none` is set for pixel text — `italic` has no effect there (by design).
- Scanlines are a fixed `body::after` overlay with `pointer-events: none`.

### Minimal theme notes

- `--font-serif` points at Inter (already self-hosted), made semibold with tight tracking by a base rule on
  `.font-serif`; `italic` on headings is neutralised (the gray color carries the contrast instead).
- Tags are switched to the sans font by an unlayered rule (the template uses `font-mono`).
- No `.prompt` prefix; the cursor is a thin accent caret. Active nav item is a gray pill.

### apple-web-2 theme notes

- `--canvas` (theme-only variable) is the gray backdrop on `body`; `.site-shell` is the white sheet
  (`overflow-x: clip`, not `hidden`, so the sticky header keeps working). The header gets matching top radius.
- `.container-page` is narrowed to `max-w-5xl`; button padding is made compact by an unlayered rule.

## Work visibility

`work: { engineering, design }` in `app.config.ts` (both default `true`) picks which kinds of projects are published.
Always query projects through `useProjects()` (`app/composables/useContentQueries.ts`), which applies it; `[slug].vue`
404s a switched-off kind, `sitemap.xml` filters it, and links to hidden projects (Markdown via `ProseA`, `ExperienceTimeline`,
the Lab page) go through `useHiddenProjectSlugs()` / `isHiddenWorkLink()` so the prerender crawler never hits a 404.

## Design case studies

Design projects use extra Markdown components on top of `gallery`: `process-steps`, `color-palette` (brand hex values are
content, so swatches use inline styles), `symbol-explorer`, and `gallery` with `fit: contain` / `cols: 3` / per-image
`caption`. Crops of an original image live next to it in `public/images/work/<slug>/`; new diagrams are SVGs there too
(served as-is by `ProseImg`). Quote YAML values that contain a comma or colon.

## GitHub contributions

`GitHubContributions` (home page) reads `/github-contributions.json`, a server route
(`server/routes/github-contributions.json.ts`) prerendered at build time from the public
github-contributions-api.jogruber.de API for `github.username` in `app.config.ts`. If the build can't
reach it, the JSON is empty and the component retries once from the browser, then shows an empty state.

## Chat ("Ask something")

`app/components/layout/AskChat.vue` is the floating chat entry point; `askChat.provider` in `app.config.ts` picks it:

- `'whatsapp'` (default): our own button with the `.ask-btn` theme hook, linking to `api.whatsapp.com/send?phone=<askChat.whatsapp.number>`
  (not `wa.me`: its cross-origin redirect trips Firefox's COOP check, `NS_ERROR_DOM_COOP_FAILED`)
  with a pre-filled message. Hidden while the number is empty.
- `'crisp'`: no button of ours — Crisp is loaded once the browser is idle and shows its own launcher. Don't restyle or
  hide Crisp's widget; its look is managed in the Crisp dashboard.

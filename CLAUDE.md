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

- Site data (profile, nav, socials, Crisp id) lives in `app/app.config.ts`, not in components.
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
export const themes = ['editorial', 'retro'] as const
export const activeTheme: ThemeName = 'retro'   // ← change this and rebuild
```

| Theme       | Look                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------- |
| `editorial` | The original design: Instrument Serif headlines, soft paper colors, rounded pill buttons. |
| `retro`     | Old-school video game (current): Press Start 2P pixel font, square corners, hard offset shadows, pixel grid background, CRT scanlines, blinking cursors. |

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

## Chat (Crisp)

`app/components/layout/AskChat.vue` lazy-loads Crisp only when the visitor clicks "Ask something". Crisp's
own launcher is hidden (`chat:hide` on `chat:closed`) so our button is always the entry point; it is shown
again on `message:received`. Don't remove that, or Crisp's default bubble replaces the custom button.

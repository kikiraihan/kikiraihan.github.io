// Site theme — the single hardcoded switch for the whole look of the site.
// Change `activeTheme` and rebuild; nothing else needs to change. See CLAUDE.md → Theming.
//
//   'editorial' — the original look: serif headlines, soft paper colors, rounded pills
//   'retro'     — old-school video game: pixel font, hard shadows, CRT scanlines
//
// Each theme lives in app/assets/css/themes/<name>.css and is applied through
// <html data-theme="<name>"> (set in nuxt.config.ts, so it is in the prerendered HTML).

export const themes = ['editorial', 'retro'] as const

export type ThemeName = typeof themes[number]

export const activeTheme: ThemeName = 'retro'

import { activeTheme } from '~/theme.config'
import type { ThemeName } from '~/theme.config'

/**
 * The active site theme (from app/theme.config.ts). Prefer styling through CSS theme hooks;
 * use this only when a theme needs different markup, e.g. `v-if="isTheme('retro')"`.
 */
export function useTheme() {
  return {
    theme: activeTheme,
    isTheme: (name: ThemeName) => activeTheme === name,
  }
}

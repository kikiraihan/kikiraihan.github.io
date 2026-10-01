import type { RouterConfig } from '@nuxt/schema'

// Smooth scrolling only for in-page #anchor links (e.g. headings in articles).
// The scroll-to-top on a route change stays instant — see the note on `html` in main.css.
export default {
  scrollBehaviorType: 'smooth',
} satisfies RouterConfig

import tailwindcss from '@tailwindcss/vite'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://kikiraihan.github.io'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/icon', '@nuxt/eslint'],

  // Flat component names (<ProjectCard>, not <WorkProjectCard>); folders are only for organisation.
  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      siteUrl,
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      script: [
        {
          // Apply theme before first paint to avoid a flash of the wrong color scheme.
          // Same localStorage key as the old site ("color-scheme") so saved preferences carry over.
          innerHTML: `(function(){try{var s=localStorage.getItem('color-scheme');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;var h=document.documentElement;h.classList.toggle('dark',d);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)h.classList.add('js-motion')}catch(e){}})()`,
          tagPosition: 'head',
        },
      ],
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: { default: 'github-light', dark: 'github-dark' },
          langs: ['ts', 'js', 'vue', 'php', 'python', 'sql', 'bash', 'json', 'yaml'],
        },
      },
    },
    experimental: { sqliteConnector: 'native' },
  },

  image: {
    quality: 80,
  },

  // Icons are bundled locally (no runtime requests to the Iconify API).
  icon: {
    serverBundle: 'local',
    clientBundle: {
      scan: true,
      // icons referenced only from app.config.ts (not picked up by the scanner)
      icons: ['simple-icons:github', 'simple-icons:linkedin', 'simple-icons:instagram', 'simple-icons:x'],
      sizeLimitKb: 256,
    },
  },


  // Everything is static: prerender the whole site and let the crawler discover links.
  nitro: {
    prerender: {
      // /work → work.html (GitHub Pages serves it without a trailing-slash redirect)
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/robots.txt'],
    },
  },

  routeRules: {
    '/**': { prerender: true },
    // Keep old Hugo URLs working
    '/resume': { redirect: '/about' },
    '/projects': { redirect: '/work' },
    '/design': { redirect: '/work?type=design' },
    '/blogs': { redirect: '/writing' },
    '/blogs/pertama': { redirect: '/writing/anak-anak-masjid' },
    '/projects/mrm': { redirect: '/work/makassar-raya-motor' },
    '/projects/pembimbing_sisa': { redirect: '/work/jadwalin' },
    '/projects/vektorpedia': { redirect: '/work/vektorpedia' },
    '/projects/contag': { redirect: '/work/contag' },
    '/projects/digimosque': { redirect: '/work/digimosque' },
    '/projects/timemarket': { redirect: '/work/timemarket' },
    '/projects/sindasi': { redirect: '/work/sindasi' },
    '/projects/kongkong': { redirect: '/work/kongkong' },
    '/projects/panah-papua': { redirect: '/work/panah-papua' },
    '/projects/ipb-summer-2023': { redirect: '/work/ipb-summer-2023' },
  },

  eslint: {
    config: { stylistic: false },
  },
})

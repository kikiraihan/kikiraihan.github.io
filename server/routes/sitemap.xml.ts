import { queryCollection } from '@nuxt/content/server'

// Prerendered to /sitemap.xml at build time.
// Every page is listed in English (/work) and Indonesian (/id/work), each with hreflang alternates.
export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const { work } = useAppConfig()

  // English is the full set (untranslated pages fall back to English), so its paths are used for both languages.
  const [projects, articlesEn, articlesId] = await Promise.all([
    queryCollection(event, 'projects_en').where('draft', '=', false).select('path', 'type').all(),
    queryCollection(event, 'writing_en').where('draft', '=', false).select('path', 'date').all(),
    queryCollection(event, 'writing_id').where('draft', '=', false).select('path', 'date').all(),
  ])
  const articles = [...articlesEn, ...articlesId.filter(a => !articlesEn.some(e => e.path === a.path))]

  const urls: { path: string, lastmod?: string }[] = [
    ...['/', '/work', '/about', '/writing', '/lab', '/contact'].map(path => ({ path })),
    // only the kinds of work switched on in app.config.ts (`work`)
    ...projects.filter(p => work?.[p.type ?? 'engineering'] !== false).map(p => ({ path: p.path.replace(/^\/projects/, '/work') })),
    ...articles.map(a => ({ path: a.path, lastmod: a.date })),
  ]

  const loc = (path: string, locale: 'en' | 'id') => {
    const localized = locale === 'id' ? `/id${path === '/' ? '' : path}` : path
    return `${siteUrl}${localized === '/' ? '' : localized}`
  }
  const alternates = (path: string) => [
    `<xhtml:link rel="alternate" hreflang="en" href="${loc(path, 'en')}"/>`,
    `<xhtml:link rel="alternate" hreflang="id" href="${loc(path, 'id')}"/>`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${loc(path, 'en')}"/>`,
  ].join('')

  const body = urls
    .flatMap(u => (['en', 'id'] as const).map(locale =>
      `  <url><loc>${loc(u.path, locale)}</loc>${alternates(u.path)}${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
    ))
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`
})

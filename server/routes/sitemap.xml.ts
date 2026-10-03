import { queryCollection } from '@nuxt/content/server'

// Prerendered to /sitemap.xml at build time.
export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const { work } = useAppConfig()

  const [projects, articles] = await Promise.all([
    queryCollection(event, 'projects').where('draft', '=', false).select('path', 'type').all(),
    queryCollection(event, 'writing').where('draft', '=', false).select('path', 'date').all(),
  ])

  const urls: { path: string, lastmod?: string }[] = [
    ...['/', '/work', '/about', '/writing', '/lab', '/contact'].map(path => ({ path })),
    // only the kinds of work switched on in app.config.ts (`work`)
    ...projects.filter(p => work?.[p.type ?? 'engineering'] !== false).map(p => ({ path: p.path.replace(/^\/projects/, '/work') })),
    ...articles.map(a => ({ path: a.path, lastmod: a.date })),
  ]

  const body = urls
    .map(u => `  <url><loc>${siteUrl}${u.path === '/' ? '' : u.path}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})

interface PageSeo {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/** Title, description, canonical, Open Graph, Twitter card and JSON-LD for one page. */
export function usePageSeo(seo: PageSeo) {
  const route = useRoute()
  const { siteUrl } = useRuntimeConfig().public
  const { profile } = useAppConfig()

  const url = `${siteUrl}${route.path === '/' ? '' : route.path}`
  const image = `${siteUrl}${seo.image ?? '/og.png'}`
  const fullTitle = seo.title === profile.name ? seo.title : `${seo.title} — ${profile.name}`

  useSeoMeta({
    title: fullTitle,
    description: seo.description,
    ogTitle: fullTitle,
    ogDescription: seo.description,
    ogType: seo.type ?? 'website',
    ogUrl: url,
    ogImage: image,
    ogSiteName: profile.name,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: seo.description,
    twitterImage: image,
    twitterSite: '@inikikikatili',
    articlePublishedTime: seo.publishedTime,
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
    script: seo.jsonLd
      ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(seo.jsonLd) }]
      : [],
  })
}

// Content queries shared between pages. Drafts are never listed.
// Every collection exists once per language (`projects_en`, `projects_id`, … — see content.config.ts).
// The current language is queried first; anything without a translation falls back to English.

export type WorkType = 'engineering' | 'design'
export type ContentLocale = 'en' | 'id'

const FALLBACK: ContentLocale = 'en'

/** The current language as a content locale. */
export function useContentLocale() {
  const { locale } = useI18n()
  return computed(() => (locale.value === 'id' ? 'id' : 'en') as ContentLocale)
}

// All locales of a collection share one schema, so the English collection's type stands for all of them.
const projectsOf = (l: ContentLocale) => `projects_${l}` as 'projects_en'
const writingOf = (l: ContentLocale) => `writing_${l}` as 'writing_en'
const pagesOf = (l: ContentLocale) => `pages_${l}` as 'pages_en'
const experienceOf = (l: ContentLocale) => `experience_${l}` as 'experience_en'
const labOf = (l: ContentLocale) => `lab_${l}` as 'lab_en'

/** Merge a translated list with the English one: translated items win, untranslated ones stay in English. */
function withFallback<T extends { path: string }>(translated: T[], fallback: T[]) {
  const have = new Set(translated.map(i => i.path))
  return [...translated, ...fallback.filter(i => !have.has(i.path))]
}

/** Kinds of work switched on in app.config.ts (`work.engineering` / `work.design`). */
export function useWorkTypes(): WorkType[] {
  const { work } = useAppConfig()
  return (['engineering', 'design'] as const).filter(t => work?.[t] !== false)
}

export function useProjects(key: string, opts: { featured?: boolean } = {}) {
  const types = useWorkTypes()
  const locale = useContentLocale()
  return useAsyncData(`${key}-${types.join('-')}-${locale.value}`, async () => {
    if (!types.length) return []
    const query = (l: ContentLocale) => {
      let q = queryCollection(projectsOf(l)).where('draft', '=', false).where('type', 'IN', types).order('order', 'ASC')
      if (opts.featured) q = q.where('featured', '=', true)
      return q.all()
    }
    if (locale.value === FALLBACK) return query(FALLBACK)
    const [translated, fallback] = await Promise.all([query(locale.value), query(FALLBACK)])
    return withFallback(translated, fallback).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  })
}

/** One project by slug, in the current language (English if it has no translation). */
export function useProject(slug: string) {
  const locale = useContentLocale()
  return useAsyncData(`project-${slug}-${locale.value}`, async () => {
    const path = `/projects/${slug}`
    return (await queryCollection(projectsOf(locale.value)).path(path).first())
      ?? (locale.value === FALLBACK ? null : await queryCollection(projectsOf(FALLBACK)).path(path).first())
  })
}

/** Slugs of projects whose kind of work is switched off — links to them are rendered as plain text, not as a 404. */
export function useHiddenProjectSlugs() {
  const types = useWorkTypes()
  return useAsyncData(`hidden-projects-${types.join('-')}`, async () => {
    if (types.length === 2) return [] as string[]
    // the type of a project is the same in every language, so English is enough
    const rows = await queryCollection(projectsOf(FALLBACK)).select('path', 'type').all()
    return rows.filter(p => !types.includes(p.type ?? 'engineering')).map(p => slugFromPath(p.path))
  }, { default: () => [] as string[] })
}

/** "/work/<slug>" (optionally with #hash or ?query, or an /id prefix) → true when that project is hidden. */
export function isHiddenWorkLink(href: string | undefined, hidden: string[]) {
  const m = href?.match(/^(?:\/id)?\/work\/([^/?#]+)/)
  return !!m && hidden.includes(m[1]!)
}

// Lab notes (`lab: true`) are left out: they are linked from the Lab page (content/<locale>/data/lab.yml).
export function useArticles(key = 'writing') {
  const locale = useContentLocale()
  return useAsyncData(`${key}-${locale.value}`, async () => {
    const query = (l: ContentLocale) => queryCollection(writingOf(l)).where('draft', '=', false).where('lab', '=', false).order('date', 'DESC').all()
    if (locale.value === FALLBACK) return query(FALLBACK)
    const [translated, fallback] = await Promise.all([query(locale.value), query(FALLBACK)])
    return withFallback(translated, fallback).sort((a, b) => b.date.localeCompare(a.date))
  })
}

/**
 * One article by slug, in the current language. Falls back to any other language it exists in
 * (e.g. an article written only in Indonesian still opens on the English site).
 */
export function useArticle(slug: string) {
  const locale = useContentLocale()
  return useAsyncData(`writing-${slug}-${locale.value}`, async () => {
    const path = `/writing/${slug}`
    for (const l of [locale.value, ...(['en', 'id'] as const).filter(l => l !== locale.value)]) {
      const article = await queryCollection(writingOf(l)).path(path).first()
      if (article) return { ...article, lang: l }
    }
    return null
  })
}

/** A static page's long-form copy (content/<locale>/pages/<name>.md). */
export function usePage(name: string) {
  const locale = useContentLocale()
  return useAsyncData(`page-${name}-${locale.value}`, async () => {
    const path = `/pages/${name}`
    return (await queryCollection(pagesOf(locale.value)).path(path).first())
      ?? (locale.value === FALLBACK ? null : await queryCollection(pagesOf(FALLBACK)).path(path).first())
  })
}

export function useExperience() {
  const locale = useContentLocale()
  return useAsyncData(`experience-${locale.value}`, async () =>
    (await queryCollection(experienceOf(locale.value)).first()) ?? queryCollection(experienceOf(FALLBACK)).first(),
  )
}

export function useLab() {
  const locale = useContentLocale()
  return useAsyncData(`lab-${locale.value}`, async () =>
    (await queryCollection(labOf(locale.value)).first()) ?? queryCollection(labOf(FALLBACK)).first(),
  )
}

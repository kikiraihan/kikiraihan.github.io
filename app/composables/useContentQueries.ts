// Content queries shared between pages. Drafts are never listed.

export type WorkType = 'engineering' | 'design'

/** Kinds of work switched on in app.config.ts (`work.engineering` / `work.design`). */
export function useWorkTypes(): WorkType[] {
  const { work } = useAppConfig()
  return (['engineering', 'design'] as const).filter(t => work?.[t] !== false)
}

export function useProjects(key: string, opts: { featured?: boolean } = {}) {
  const types = useWorkTypes()
  return useAsyncData(`${key}-${types.join('-')}`, async () => {
    if (!types.length) return []
    let q = queryCollection('projects').where('draft', '=', false).where('type', 'IN', types).order('order', 'ASC')
    if (opts.featured) q = q.where('featured', '=', true)
    return q.all()
  })
}

/** Slugs of projects whose kind of work is switched off — links to them are rendered as plain text, not as a 404. */
export function useHiddenProjectSlugs() {
  const types = useWorkTypes()
  return useAsyncData(`hidden-projects-${types.join('-')}`, async () => {
    if (types.length === 2) return [] as string[]
    const rows = await queryCollection('projects').select('path', 'type').all()
    return rows.filter(p => !types.includes(p.type ?? 'engineering')).map(p => slugFromPath(p.path))
  }, { default: () => [] as string[] })
}

/** "/work/<slug>" (optionally with #hash or ?query) → true when that project is hidden. */
export function isHiddenWorkLink(href: string | undefined, hidden: string[]) {
  const m = href?.match(/^\/work\/([^/?#]+)/)
  return !!m && hidden.includes(m[1]!)
}

export function useArticles(key = 'writing') {
  return useAsyncData(key, () =>
    queryCollection('writing').where('draft', '=', false).order('date', 'DESC').all(),
  )
}

export function useExperience() {
  return useAsyncData('experience', () => queryCollection('experience').first())
}

// Content queries shared between pages. Drafts are never listed.

export function useProjects(key: string, opts: { featured?: boolean } = {}) {
  return useAsyncData(key, () => {
    let q = queryCollection('projects').where('draft', '=', false).order('order', 'ASC')
    if (opts.featured) q = q.where('featured', '=', true)
    return q.all()
  })
}

export function useArticles(key = 'writing') {
  return useAsyncData(key, () =>
    queryCollection('writing').where('draft', '=', false).order('date', 'DESC').all(),
  )
}

export function useExperience() {
  return useAsyncData('experience', () => queryCollection('experience').first())
}

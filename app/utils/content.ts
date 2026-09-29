/** Rough reading time from a Nuxt Content minimark body. */
export function readingTime(body: unknown, wpm = 220): number {
  let words = 0
  const walk = (node: unknown) => {
    if (typeof node === 'string') {
      words += node.trim().split(/\s+/).filter(Boolean).length
    }
    else if (Array.isArray(node)) {
      // minimark node: [tag, props, ...children]
      const [tag, , ...children] = node
      if (tag === 'pre' || tag === 'code') return
      children.forEach(walk)
    }
  }
  const value = (body as { value?: unknown[] } | undefined)?.value ?? []
  value.forEach(walk)
  return Math.max(1, Math.round(words / wpm))
}

export function formatDate(date: string, locale = 'en') {
  return new Date(date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** "/projects/vektorpedia" → "vektorpedia" */
export function slugFromPath(path: string) {
  return path.split('/').filter(Boolean).pop() ?? ''
}

import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Content is split per language: content/en/** and content/id/** (same file names in both).
// Every collection below exists once per locale, e.g. `projects_en` and `projects_id`.
// Query them through the helpers in app/composables/useContentQueries.ts, which fall back to English
// when a translation is missing.
export const contentLocales = ['en', 'id'] as const

const metric = z.object({
  value: z.string(),
  label: z.string(),
})

const architectureNode = z.object({
  id: z.string(),
  label: z.string(),
  detail: z.string().optional(),
})

function localeCollections(locale: (typeof contentLocales)[number]) {
  return {
    // content/<locale>/projects/*.md  →  /work/[slug]
    [`projects_${locale}`]: defineCollection({
      type: 'page',
      // prefix keeps the path locale-free (/projects/<slug>), the same in every language
      source: { include: `${locale}/projects/*.md`, prefix: '/projects' },
      schema: z.object({
        type: z.enum(['engineering', 'design']).default('engineering'),
        category: z.string(),
        year: z.number(),
        timeline: z.string().optional(),
        role: z.string(),
        company: z.string().optional(),
        technologies: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        order: z.number().default(99),
        metrics: z.array(metric).default([]),
        architecture: z.array(architectureNode).optional(),
        contribution: z.object({
          team: z.string().optional(),
          mine: z.string().optional(),
        }).optional(),
        links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
        cover: z.string(),
        draft: z.boolean().default(false),
      }),
    }),

    // content/<locale>/writing/*.md  →  /writing/[slug]
    [`writing_${locale}`]: defineCollection({
      type: 'page',
      source: { include: `${locale}/writing/*.md`, prefix: '/writing' },
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).default([]),
        cover: z.string().optional(),
        // language the article was originally written in; a different value marks this file as a translation
        original: z.enum(contentLocales).optional(),
        draft: z.boolean().default(false),
      }),
    }),

    // content/<locale>/pages/*.md — long-form copy for static pages (e.g. About)
    [`pages_${locale}`]: defineCollection({
      type: 'page',
      source: { include: `${locale}/pages/*.md`, prefix: '/pages' },
    }),

    // content/<locale>/data/experience.yml
    [`experience_${locale}`]: defineCollection({
      type: 'data',
      source: `${locale}/data/experience.yml`,
      schema: z.object({
        items: z.array(z.object({
          company: z.string(),
          role: z.string(),
          period: z.string(),
          location: z.string().optional(),
          kind: z.enum(['work', 'education', 'organization']).default('work'),
          summary: z.string(),
          highlights: z.array(z.string()).default([]),
          project: z.string().optional(),
          // external site of the company/project, shown as a link under the highlights
          url: z.string().optional(),
        })),
      }),
    }),

    // content/<locale>/data/lab.yml
    [`lab_${locale}`]: defineCollection({
      type: 'data',
      source: `${locale}/data/lab.yml`,
      schema: z.object({
        items: z.array(z.object({
          title: z.string(),
          kind: z.string(),
          year: z.number(),
          description: z.string(),
          tags: z.array(z.string()).default([]),
          image: z.string().optional(),
          url: z.string().optional(),
        })),
      }),
    }),
  }
}

export default defineContentConfig({
  collections: {
    ...localeCollections('en'),
    ...localeCollections('id'),
  },
})

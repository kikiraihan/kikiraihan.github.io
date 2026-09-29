import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const metric = z.object({
  value: z.string(),
  label: z.string(),
})

const architectureNode = z.object({
  id: z.string(),
  label: z.string(),
  detail: z.string().optional(),
})

export default defineContentConfig({
  collections: {
    // content/projects/*.md  →  /work/[slug]
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
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

    // content/writing/*.md  →  /writing/[slug]
    writing: defineCollection({
      type: 'page',
      source: 'writing/*.md',
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).default([]),
        cover: z.string().optional(),
        lang: z.string().default('en'),
        draft: z.boolean().default(false),
      }),
    }),

    // content/pages/*.md — long-form copy for static pages (e.g. About)
    pages: defineCollection({
      type: 'page',
      source: 'pages/*.md',
    }),

    // content/data/experience.yml
    experience: defineCollection({
      type: 'data',
      source: 'data/experience.yml',
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
        })),
      }),
    }),

    // content/data/lab.yml
    lab: defineCollection({
      type: 'data',
      source: 'data/lab.yml',
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
  },
})

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: article } = await useAsyncData(`writing-${slug}`, () =>
  queryCollection('writing').path(`/writing/${slug}`).first(),
)
if (!article.value || article.value.draft) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const { data: all } = await useArticles()
// Related = shares at least one tag, most shared tags first.
const related = computed(() => {
  const own = new Set(article.value!.tags ?? [])
  return (all.value ?? [])
    .filter(a => a.path !== article.value!.path)
    .map(a => ({ a, score: (a.tags ?? []).filter(t => own.has(t)).length }))
    .filter(x => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map(x => x.a)
})

const minutes = readingTime(article.value.body)
const { siteUrl } = useRuntimeConfig().public
const { profile } = useAppConfig()

usePageSeo({
  title: article.value.title,
  description: article.value.description ?? '',
  image: article.value.cover,
  type: 'article',
  publishedTime: article.value.date,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.value.title,
    'description': article.value.description,
    'datePublished': article.value.date,
    'inLanguage': article.value.lang,
    'image': article.value.cover ? `${siteUrl}${article.value.cover}` : undefined,
    'author': { '@type': 'Person', 'name': profile.name, 'url': siteUrl },
    'keywords': (article.value.tags ?? []).join(', '),
  },
})
</script>

<template>
  <article v-if="article" class="container-page pt-12 md:pt-20" :lang="article.lang">
    <header class="mx-auto max-w-3xl">
      <NuxtLink to="/writing" class="eyebrow link-underline inline-flex items-center gap-1 hover:text-ink">
        <Icon name="lucide:arrow-left" class="size-3" aria-hidden="true" /> Writing
      </NuxtLink>
      <h1 class="mt-10 font-serif text-headline">
        {{ article.title }}
      </h1>
      <p class="mt-6 text-lg text-ink-2">
        {{ article.description }}
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-4 font-mono text-xs text-ink-3">
        <time :datetime="article.date">{{ formatDate(article.date, article.lang) }}</time>
        <span aria-hidden="true">·</span>
        <span>{{ minutes }} min read</span>
        <TagList v-if="article.tags?.length" :tags="article.tags" label="Tags" class="ml-auto" />
      </div>
    </header>

    <ContentRenderer :value="article" class="prose-page mx-auto mt-12 max-w-3xl" />

    <aside v-if="related.length" class="mx-auto mt-24 max-w-3xl border-t border-line pt-10" aria-labelledby="related">
      <h2 id="related" class="eyebrow mb-6">
        Related articles
      </h2>
      <ul class="space-y-4">
        <li v-for="r in related" :key="r.path">
          <NuxtLink :to="`/writing/${slugFromPath(r.path)}`" class="link-underline font-serif text-2xl">
            {{ r.title }}
          </NuxtLink>
        </li>
      </ul>
    </aside>
  </article>
</template>

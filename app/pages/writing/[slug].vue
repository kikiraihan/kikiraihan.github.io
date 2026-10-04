<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { t, locale } = useI18n()
const localePath = useLocalePath()

// current language first; `lang` is the language actually shown (another one when there is no translation)
const { data: article } = await useArticle(slug)
if (!article.value || article.value.draft) {
  throw createError({ statusCode: 404, statusMessage: t('writing.notFound'), fatal: true })
}
// translated from another language / only available in another language
const translated = computed(() => !!article.value?.original && article.value.original !== article.value.lang)
const untranslated = computed(() => article.value?.lang !== locale.value)

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
      <NuxtLink :to="localePath('/writing')" class="eyebrow link-underline inline-flex items-center gap-1 hover:text-ink">
        <Icon name="lucide:arrow-left" class="size-3" aria-hidden="true" /> {{ $t('writing.back') }}
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
        <span>{{ $t('writing.minRead', { n: minutes }) }}</span>
        <TagList v-if="article.tags?.length" :tags="article.tags" :label="$t('writing.tags')" class="ml-auto" />
      </div>
      <p v-if="untranslated || translated" class="mt-4 flex items-center gap-2 text-xs text-ink-3" :lang="locale">
        <Icon name="lucide:languages" class="size-3.5" aria-hidden="true" />
        {{ untranslated ? $t('writing.untranslated') : $t('writing.translated') }}
      </p>
    </header>

    <ContentRenderer :value="article" class="prose-page mx-auto mt-12 max-w-3xl" />

    <aside v-if="related.length" class="mx-auto mt-24 max-w-3xl border-t border-line pt-10" aria-labelledby="related">
      <h2 id="related" class="eyebrow mb-6">
        {{ $t('writing.related') }}
      </h2>
      <ul class="space-y-4">
        <li v-for="r in related" :key="r.path">
          <NuxtLink :to="localePath(`/writing/${slugFromPath(r.path)}`)" class="link-underline font-serif text-2xl">
            {{ r.title }}
          </NuxtLink>
        </li>
      </ul>
    </aside>
  </article>
</template>

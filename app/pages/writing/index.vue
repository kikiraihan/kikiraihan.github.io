<script setup lang="ts">
// `t` is the tag variable in the template, so the translate function gets another name here
const { t: translate, locale } = useI18n()
const localePath = useLocalePath()
usePageSeo({
  title: translate('writing.seoTitle'),
  description: translate('writing.seoDescription'),
})

const { data: articles } = await useArticles()
const tag = ref<string | null>(null)
const tags = computed(() => [...new Set((articles.value ?? []).flatMap(a => a.tags ?? []))].sort())
const visible = computed(() => (articles.value ?? []).filter(a => !tag.value || (a.tags ?? []).includes(tag.value)))
</script>

<template>
  <div class="container-page pt-16 md:pt-24">
    <SectionHeading as="h1" :eyebrow="$t('writing.eyebrow')" :title="$t('writing.title')">
      <p>{{ $t('writing.intro') }}</p>
    </SectionHeading>

    <div v-if="tags.length" class="mb-10 flex flex-wrap gap-2" role="group" :aria-label="$t('writing.filter')">
      <button
        type="button"
        class="rounded-full border px-3 py-1 text-xs"
        :class="!tag ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink'"
        :aria-pressed="!tag"
        @click="tag = null"
      >
        {{ $t('common.all') }}
      </button>
      <button
        v-for="t in tags"
        :key="t"
        type="button"
        class="rounded-full border px-3 py-1 text-xs"
        :class="tag === t ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink'"
        :aria-pressed="tag === t"
        @click="tag = t"
      >
        {{ t }}
      </button>
    </div>

    <ol class="border-t border-line">
      <li v-for="a in visible" :key="a.path" v-reveal class="border-b border-line">
        <NuxtLink :to="localePath(`/writing/${slugFromPath(a.path)}`)" class="group grid gap-2 py-8 md:grid-cols-12 md:gap-6">
          <span class="font-mono text-xs text-ink-3 md:col-span-2 md:pt-3">
            <time :datetime="a.date">{{ formatDate(a.date, locale) }}</time>
          </span>
          <span class="md:col-span-8">
            <span class="block font-serif text-3xl leading-tight transition-colors group-hover:text-accent md:text-4xl">{{ a.title }}</span>
            <span class="mt-2 block text-ink-2">{{ a.description }}</span>
          </span>
          <span class="flex flex-wrap items-start gap-1.5 md:col-span-2 md:justify-end md:pt-3">
            <span class="font-mono text-[11px] text-ink-3">{{ $t('writing.min', { n: readingTime(a.body) }) }}</span>
          </span>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

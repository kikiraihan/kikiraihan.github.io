<script setup lang="ts">
usePageSeo({
  title: 'Writing',
  description: 'Notes on engineering, AI, design and the occasional personal story.',
})

const { data: articles } = await useArticles()
const tag = ref<string | null>(null)
const tags = computed(() => [...new Set((articles.value ?? []).flatMap(a => a.tags ?? []))].sort())
const visible = computed(() => (articles.value ?? []).filter(a => !tag.value || (a.tags ?? []).includes(tag.value)))
</script>

<template>
  <div class="container-page pt-16 md:pt-24">
    <SectionHeading as="h1" eyebrow="Writing" title="Notes from the work.">
      <p>Engineering, AI, design — and sometimes just a story.</p>
    </SectionHeading>

    <div v-if="tags.length" class="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <button
        type="button"
        class="rounded-full border px-3 py-1 text-xs"
        :class="!tag ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink'"
        :aria-pressed="!tag"
        @click="tag = null"
      >
        All
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
        <NuxtLink :to="`/writing/${slugFromPath(a.path)}`" class="group grid gap-2 py-8 md:grid-cols-12 md:gap-6">
          <span class="font-mono text-xs text-ink-3 md:col-span-2 md:pt-3">
            <time :datetime="a.date">{{ formatDate(a.date) }}</time>
          </span>
          <span class="md:col-span-8">
            <span class="block font-serif text-3xl leading-tight transition-colors group-hover:text-accent md:text-4xl">{{ a.title }}</span>
            <span class="mt-2 block text-ink-2">{{ a.description }}</span>
          </span>
          <span class="flex flex-wrap items-start gap-1.5 md:col-span-2 md:justify-end md:pt-3">
            <span v-if="a.lang === 'id'" class="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-ink-3">ID</span>
            <span class="font-mono text-[11px] text-ink-3">{{ readingTime(a.body) }} min</span>
          </span>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

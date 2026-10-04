<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
usePageSeo({
  title: t('lab.seoTitle'),
  description: t('lab.seoDescription'),
})
const { data } = await useLab()
const { data: hiddenProjects } = await useHiddenProjectSlugs()
const isInternal = (url?: string) => !!url && url.startsWith('/')
</script>

<template>
  <div class="container-page pt-16 md:pt-24">
    <SectionHeading as="h1" :eyebrow="$t('lab.eyebrow')" :title="$t('lab.title')">
      <p>{{ $t('lab.intro') }}</p>
    </SectionHeading>

    <ul class="grid gap-6 sm:grid-cols-2">
      <li
        v-for="(item, i) in data?.items"
        :key="item.title"
        v-reveal="{ delay: (i % 2) * 0.08 }"
        class="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-paper transition-colors hover:border-ink"
      >
        <div class="relative aspect-[16/9] overflow-hidden bg-paper-2">
          <NuxtImg
            v-if="item.image"
            format="webp"
            :src="item.image"
            alt=""
            sizes="xs:100vw sm:50vw lg:600px"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <!-- generative placeholder for items without an image -->
          <div v-else class="lab-pattern h-full w-full" aria-hidden="true" />
        </div>
        <div class="flex flex-1 flex-col p-6">
          <p class="eyebrow">
            {{ item.kind }} · {{ item.year }}
          </p>
          <h2 class="mt-2 font-serif text-3xl">
            <NuxtLink v-if="isInternal(item.url) && !isHiddenWorkLink(item.url, hiddenProjects)" :to="localePath(item.url!)" class="after:absolute after:inset-0">
              {{ item.title }}
            </NuxtLink>
            <a v-else-if="item.url && !isInternal(item.url)" :href="item.url" target="_blank" rel="noopener" class="after:absolute after:inset-0">{{ item.title }}</a>
            <template v-else>
              {{ item.title }}
            </template>
          </h2>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-ink-2">
            {{ item.description }}
          </p>
          <TagList :tags="item.tags" class="mt-5" />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.lab-pattern {
  background:
    radial-gradient(circle at 30% 40%, var(--accent) 0 2px, transparent 3px) 0 0 / 28px 28px,
    linear-gradient(135deg, var(--paper-2), var(--paper));
  animation: drift 18s linear infinite;
}
@keyframes drift {
  to { background-position: 280px 140px, 0 0; }
}
</style>

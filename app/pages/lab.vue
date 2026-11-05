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

// Video preview: the teaser plays in a dialog on this page instead of sending visitors to GitHub.
// Native <dialog> (Esc closes, focus is trapped and restored); the player is unmounted on close, so playback stops.
type LabItem = NonNullable<typeof data.value>['items'][number]
const dialog = ref<HTMLDialogElement>()
const preview = ref<LabItem | null>(null)
function openPreview(item: LabItem) {
  preview.value = item
  nextTick(() => dialog.value?.showModal())
}
// a click on the backdrop (the <dialog> element itself, outside its panel) closes it
function onDialogClick(e: MouseEvent) {
  if (e.target === dialog.value) dialog.value?.close()
}
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
          <!-- z-10 keeps the preview button clickable above the card's stretched title link -->
          <button
            v-if="item.video"
            type="button"
            class="absolute inset-0 z-10 grid place-items-center bg-black/0 transition-colors hover:bg-black/25 focus-visible:bg-black/25"
            @click="openPreview(item)"
          >
            <span class="sr-only">{{ $t('lab.previewVideo', { title: item.title }) }}</span>
            <span class="grid size-14 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
              <Icon name="lucide:play" class="size-6 translate-x-0.5" />
            </span>
          </button>
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
          <!-- z-10 keeps the video button clickable above the card's stretched title link -->
          <button
            v-if="item.video"
            type="button"
            class="relative z-10 mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            @click="openPreview(item)"
          >
            <Icon name="lucide:circle-play" class="size-4" aria-hidden="true" />{{ $t('lab.watchVideo') }}
          </button>
        </div>
      </li>
    </ul>

    <dialog
      ref="dialog"
      class="m-auto w-[min(64rem,calc(100vw-2rem))] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      :aria-label="preview ? $t('lab.previewVideo', { title: preview.title }) : undefined"
      @click="onDialogClick"
      @close="preview = null"
    >
      <div v-if="preview" class="rounded-lg border border-line bg-paper p-3 sm:p-4">
        <div class="mb-3 flex items-center justify-between gap-4 pl-1">
          <p class="truncate text-sm font-medium">
            {{ preview.title }}
          </p>
          <div class="flex shrink-0 items-center gap-2">
            <NuxtLink
              v-if="isInternal(preview.url) && !isHiddenWorkLink(preview.url, hiddenProjects)"
              :to="localePath(preview.url!)"
              class="link-underline inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink"
            >
              {{ $t('lab.readMore') }} <Icon name="lucide:arrow-right" class="size-3.5" aria-hidden="true" />
            </NuxtLink>
            <button
              type="button"
              class="grid size-9 place-items-center rounded-full text-ink-2 hover:bg-paper-2 hover:text-ink"
              @click="dialog?.close()"
            >
              <span class="sr-only">{{ $t('lightbox.close') }}</span>
              <Icon name="lucide:x" class="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <VideoPlayer :src="preview.video!" :poster="preview.image" :live="preview.live" autoplay class="my-0!" />
      </div>
    </dialog>
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

<script setup lang="ts">
// Plays a video that may be hosted outside this site — a GitHub blob URL is turned into its raw file
// (see utils/video.ts). Used in Markdown as `::video-player{src="…" poster="…" caption="…"}` and by
// the Lab page's preview dialog. Nothing is downloaded until play (`preload="none"` + poster), unless
// `autoplay` is set. If the browser can't load the file, a link to the original stays available.
const props = withDefaults(defineProps<{
  src: string
  poster?: string
  caption?: string
  autoplay?: boolean
}>(), { poster: undefined, caption: undefined, autoplay: false })

const playable = computed(() => videoSrc(props.src))
const failed = ref(false)
const playing = ref(false) // a playing video keeps full color in dark mode (main.css, "Dark mode image tone")
watch(() => props.src, () => {
  failed.value = false
  playing.value = false
})
</script>

<template>
  <figure class="not-prose my-10">
    <div class="video-frame group relative overflow-hidden rounded-lg border border-line bg-black" :class="{ 'is-playing': playing }">
      <video
        v-if="!failed"
        :key="playable"
        :poster="poster"
        :autoplay="autoplay"
        controls
        playsinline
        :preload="autoplay ? 'auto' : 'none'"
        class="block aspect-video w-full"
        @play="playing = true"
        @pause="playing = false"
        @ended="playing = false"
      >
        <source :src="playable" :type="videoType(src)" @error="failed = true">
      </video>
      <div v-else class="grid aspect-video w-full place-items-center bg-paper-2 p-6 text-center text-sm text-ink-2">
        <p>
          {{ $t('video.failed') }}
          <a :href="src" target="_blank" rel="noopener" class="link-underline font-medium text-ink">{{ $t('video.openOriginal') }}</a>
        </p>
      </div>
    </div>
    <figcaption class="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs leading-relaxed text-ink-3">
      <span v-if="caption">{{ caption }}</span>
      <a :href="src" target="_blank" rel="noopener" class="link-underline inline-flex items-center gap-1 hover:text-ink">
        {{ videoRepo(src) ? $t('video.sourceGithub') : $t('video.openOriginal') }}
        <Icon name="lucide:arrow-up-right" class="size-3" aria-hidden="true" />
      </a>
    </figcaption>
  </figure>
</template>

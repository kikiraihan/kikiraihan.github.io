<script setup lang="ts">
// `fit: contain` shows the whole image (logos, crops, UI details) instead of filling the tile, never
// upscaling small crops past their natural size (object-scale-down keeps them sharp);
// `cols: 3` for smaller pieces; an image `caption` is shown under its tile (alt stays the hover label).
const props = withDefaults(defineProps<{
  images: { src: string, alt?: string, caption?: string }[]
  fit?: 'cover' | 'contain'
  cols?: 2 | 3
}>(), { fit: 'cover', cols: 2 })
const { open } = useLightbox()
// The odd first image spans the full row (2-column layout only).
const wide = (i: number) => props.cols === 2 && props.images.length % 2 === 1 && i === 0
</script>

<template>
  <div class="not-prose my-10 grid gap-3 sm:grid-cols-2" :class="{ 'lg:grid-cols-3': cols === 3 }">
    <figure
      v-for="(image, i) in images"
      :key="image.src"
      v-reveal="{ delay: (i % cols) * 0.08 }"
      :class="{ 'sm:col-span-2': wide(i) }"
    >
      <button
        type="button"
        class="group relative block w-full overflow-hidden rounded-lg border border-line bg-paper-2 cursor-zoom-in"
        @click="open(image)"
      >
        <NuxtImg
          format="webp"
          :src="image.src"
          :alt="image.alt ?? ''"
          sizes="xs:100vw sm:50vw lg:600px"
          loading="lazy"
          class="aspect-[4/3] h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          :class="[
            fit === 'contain' ? 'object-scale-down p-4' : 'object-cover object-top',
            { 'sm:aspect-[16/9]': wide(i) },
          ]"
        />
        <span
          v-if="image.alt"
          class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >{{ image.alt }}</span>
      </button>
      <figcaption v-if="image.caption" class="mt-2 text-xs leading-relaxed text-ink-3">
        {{ image.caption }}
      </figcaption>
    </figure>
  </div>
</template>

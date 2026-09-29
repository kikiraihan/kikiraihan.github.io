<script setup lang="ts">
defineProps<{ images: { src: string, alt?: string }[] }>()
const { open } = useLightbox()
</script>

<template>
  <div class="not-prose my-10 grid gap-3 sm:grid-cols-2">
    <button
      v-for="(image, i) in images"
      :key="image.src"
      v-reveal="{ delay: (i % 2) * 0.08 }"
      type="button"
      class="group relative overflow-hidden rounded-lg border border-line bg-paper-2 cursor-zoom-in"
      :class="{ 'sm:col-span-2': images.length % 2 === 1 && i === 0 }"
      @click="open(image)"
    >
      <NuxtImg
        format="webp"
        :src="image.src"
        :alt="image.alt ?? ''"
        sizes="xs:100vw sm:50vw lg:600px"
        loading="lazy"
        class="aspect-[4/3] h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        :class="{ 'sm:aspect-[16/9]': images.length % 2 === 1 && i === 0 }"
      />
      <span
        v-if="image.alt"
        class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >{{ image.alt }}</span>
    </button>
  </div>
</template>

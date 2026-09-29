<script setup lang="ts">
// Markdown images: optimised with Nuxt Image and clickable for a full-size preview.
const props = defineProps<{ src: string, alt?: string, width?: string | number, height?: string | number }>()
const { open } = useLightbox()
</script>

<template>
  <button type="button" class="block w-full cursor-zoom-in" @click="open({ src: props.src, alt: props.alt })">
    <span class="sr-only">Enlarge image: {{ alt }}</span>
    <NuxtImg format="webp" :src="src" :alt="alt" :width="width" :height="height" sizes="xs:100vw md:800px" loading="lazy" class="w-full" />
  </button>
</template>

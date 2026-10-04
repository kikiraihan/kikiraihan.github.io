<script setup lang="ts">
// Markdown images: optimised with Nuxt Image and clickable for a full-size preview.
// SVG diagrams are served as-is (crisp at any size), not rasterised to webp.
const props = defineProps<{ src: string, alt?: string, width?: string | number, height?: string | number }>()
const { open } = useLightbox()
const isSvg = computed(() => /\.svg($|\?)/i.test(props.src))
</script>

<template>
  <button type="button" class="block w-full cursor-zoom-in" @click="open({ src: props.src, alt: props.alt })">
    <span class="sr-only">{{ $t('common.enlargeImage', { alt }) }}</span>
    <img v-if="isSvg" :src="src" :alt="alt" :width="width" :height="height" loading="lazy" decoding="async" class="w-full">
    <NuxtImg v-else format="webp" :src="src" :alt="alt" :width="width" :height="height" sizes="xs:100vw md:800px" loading="lazy" class="w-full" />
  </button>
</template>

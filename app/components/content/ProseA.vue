<script setup lang="ts">
// Markdown links. Same as the default ProseA, except a link to a case study whose kind of work is
// switched off in app.config.ts (`work`) is rendered as plain text instead of pointing at a 404.
const props = withDefaults(defineProps<{ href?: string, target?: string }>(), { href: '', target: undefined })
const { data: hidden } = await useHiddenProjectSlugs()
</script>

<template>
  <span v-if="isHiddenWorkLink(props.href, hidden)"><slot /></span>
  <NuxtLink v-else :href="props.href" :target="props.target">
    <slot />
  </NuxtLink>
</template>

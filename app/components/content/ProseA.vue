<script setup lang="ts">
// Markdown links. Same as the default ProseA, except a link to a case study whose kind of work is
// switched off in app.config.ts (`work`) is rendered as plain text instead of pointing at a 404.
// Links to site pages are written with English paths in Markdown (/work/kongkong) and point to the
// current language (/id/work/kongkong on the Indonesian site); files (/images/…) are left alone.
const props = withDefaults(defineProps<{ href?: string, target?: string }>(), { href: '', target: undefined })
const { data: hidden } = await useHiddenProjectSlugs()
const localePath = useLocalePath()
const isPage = (href: string) => /^\/(work|writing|about|lab|contact)?(?=[/?#]|$)/.test(href)
const to = computed(() => (isPage(props.href) ? localePath(props.href) : props.href))
</script>

<template>
  <span v-if="isHiddenWorkLink(props.href, hidden)"><slot /></span>
  <NuxtLink v-else :href="to" :target="props.target">
    <slot />
  </NuxtLink>
</template>

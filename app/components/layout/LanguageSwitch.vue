<script setup lang="ts">
// EN / ID switch: links to the same page in the other language (/work ↔ /id/work).
// Plain links, so the prerender crawler also discovers every translated page through it.
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const other = computed(() => locales.value.find(l => l.code !== locale.value)!)
</script>

<template>
  <NuxtLink
    :to="switchLocalePath(other.code)"
    :hreflang="other.language"
    :lang="other.code"
    class="grid h-10 min-w-10 place-items-center rounded-full px-2 font-mono text-xs uppercase tracking-wider text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
    :title="$t('common.switchLanguage')"
  >
    <span class="sr-only">{{ $t('common.switchLanguage') }}</span>
    <span aria-hidden="true">{{ other.code }}</span>
  </NuxtLink>
</template>

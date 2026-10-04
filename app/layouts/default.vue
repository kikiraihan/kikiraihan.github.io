<script setup lang="ts">
// <html lang>, hreflang alternates and og:locale for the current language (also on the error page).
const head = useLocaleHead({ dir: false, seo: true })
useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs.lang },
  link: [...(head.value.link ?? [])],
  meta: [...(head.value.meta ?? [])],
}))
</script>

<template>
  <div class="site-shell flex min-h-dvh flex-col">
    <!-- .site-shell: theme hook for the page frame (e.g. the floating sheet in apple-web-2) -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
    >{{ $t('common.skipToContent') }}</a>
    <SiteHeader />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <AskChat />
  </div>
</template>

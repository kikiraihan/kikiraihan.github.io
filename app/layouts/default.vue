<template>
  <div class="site-shell flex min-h-dvh flex-col">
    <!-- .site-shell: theme hook for the page frame (e.g. the floating sheet in apple-web-2) -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
    >Skip to content</a>
    <SiteHeader />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <AskChat />
  </div>
</template>

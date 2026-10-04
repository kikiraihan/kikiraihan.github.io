<script setup lang="ts">
const site = useSiteConfig()
const { profile, socials } = useAppConfig()
const localePath = useLocalePath()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-32 border-t border-line">
    <div class="container-page grid gap-10 py-12 md:grid-cols-12">
      <div class="md:col-span-6">
        <p class="font-serif text-3xl leading-tight">
          {{ $t('footer.tagline') }}
        </p>
        <a :href="`mailto:${profile.email}`" class="link-underline mt-4 inline-block text-ink-2 hover:text-ink">
          {{ profile.email }}
        </a>
      </div>
      <nav class="md:col-span-3" :aria-label="$t('common.footerNav')">
        <p class="eyebrow mb-3">
          {{ $t('footer.pages') }}
        </p>
        <ul class="space-y-1.5 text-sm">
          <li v-for="item in site.nav" :key="item.to">
            <NuxtLink :to="localePath(item.to)" class="link-underline text-ink-2 hover:text-ink">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="md:col-span-3">
        <p class="eyebrow mb-3">
          {{ $t('footer.elsewhere') }}
        </p>
        <ul class="space-y-1.5 text-sm">
          <li v-for="s in socials" :key="s.url">
            <a :href="s.url" target="_blank" rel="noopener" class="link-underline inline-flex items-center gap-2 text-ink-2 hover:text-ink">
              <Icon :name="s.icon" class="size-3.5" aria-hidden="true" />{{ s.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="container-page flex flex-wrap justify-between gap-2 border-t border-line py-6 text-xs text-ink-3">
      <p>© {{ year }} {{ profile.name }}</p>
      <p>{{ $t('footer.builtWith') }}</p>
    </div>
  </footer>
</template>

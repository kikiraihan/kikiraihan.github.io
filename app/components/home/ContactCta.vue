<script setup lang="ts">
const { profile, socials } = useAppConfig()
</script>

<template>
  <section class="container-page mt-32 md:mt-48" aria-labelledby="contact-cta">
    <p class="eyebrow mb-6">
      {{ $t('contactCta.eyebrow') }}
    </p>
    <h2 id="contact-cta" v-reveal class="font-serif text-display">
      {{ $t('contactCta.title') }} <em class="text-accent">{{ $t('contactCta.titleEm') }}</em>
    </h2>
    <div v-reveal="{ delay: 0.1 }" class="mt-10 flex flex-wrap items-center gap-3">
      <AppButton :href="`mailto:${profile.email}`" icon="lucide:arrow-up-right" magnetic>
        {{ profile.email }}
      </AppButton>
      <AppButton
        v-for="s in socials.slice(0, 2)"
        :key="s.url"
        :href="s.url"
        variant="outline"
      >
        {{ s.label }}
      </AppButton>
    </div>
  </section>
</template>

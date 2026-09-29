<script setup lang="ts">
const { profile, socials } = useAppConfig()
</script>

<template>
  <section class="container-page mt-32 md:mt-48" aria-labelledby="contact-cta">
    <p class="eyebrow mb-6">
      Contact
    </p>
    <h2 id="contact-cta" v-reveal class="font-serif text-display">
      Let's build <em class="text-accent">something.</em>
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

<script setup lang="ts">
const { profile, socials } = useAppConfig()
usePageSeo({
  title: 'Contact',
  description: `Get in touch with ${profile.name} — email, GitHub or LinkedIn.`,
})

const copied = ref(false)
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  catch {
    window.location.href = `mailto:${profile.email}`
  }
}
</script>

<template>
  <div class="container-page pt-16 md:pt-24">
    <p class="eyebrow">
      Contact
    </p>
    <h1 class="mt-6 font-serif text-display">
      Let's build <em class="text-accent">something.</em>
    </h1>
    <p class="mt-8 max-w-xl text-lg text-ink-2">
      Hiring, collaborating, or just curious about something I've built — email is the fastest way to reach me.
    </p>
    <p class="mt-4 flex items-center gap-2 text-sm text-ink-3">
      <Icon name="lucide:map-pin" class="size-4" aria-hidden="true" />
      Based in {{ profile.location }} · WIB (UTC+7)
    </p>

    <div class="mt-12 flex flex-wrap items-center gap-3">
      <AppButton :href="`mailto:${profile.email}`" icon="lucide:arrow-up-right" magnetic>
        {{ profile.email }}
      </AppButton>
      <button type="button" class="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm hover:border-ink" @click="copyEmail">
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-4" aria-hidden="true" />
        <span aria-live="polite">{{ copied ? 'Copied' : 'Copy email' }}</span>
      </button>
    </div>

    <ul class="mt-20 border-t border-line">
      <li v-for="s in socials" :key="s.url" class="border-b border-line">
        <a :href="s.url" target="_blank" rel="noopener" class="group flex items-center justify-between gap-4 py-6">
          <span class="flex items-center gap-4">
            <Icon :name="s.icon" class="size-5 text-ink-3 group-hover:text-accent" aria-hidden="true" />
            <span class="font-serif text-3xl md:text-4xl">{{ s.label }}</span>
          </span>
          <span class="flex items-center gap-2 text-sm text-ink-2">
            <span class="hidden sm:inline">{{ s.handle }}</span>
            <Icon name="lucide:arrow-up-right" class="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

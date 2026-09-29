<script setup lang="ts">
const { profile } = useAppConfig()
const typed = useTypewriter(profile.typed)
const portrait = ref<HTMLElement>()

// Subtle parallax on the portrait while scrolling past the hero.
onMounted(async () => {
  if (!motionAllowed() || !portrait.value) return
  const gsap = await loadScrollTrigger()
  gsap.to(portrait.value, {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: portrait.value, start: 'top top', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <section class="container-page relative pb-16 pt-12 md:pb-28 md:pt-20" aria-labelledby="hero-title">
    <div class="grid items-end gap-10 md:grid-cols-12">
      <div class="md:col-span-8">
        <p class="hero-in eyebrow flex items-center gap-3" style="--d: 0ms">
          <span class="blink inline-block size-2 bg-accent" aria-hidden="true" />
          {{ profile.role }} — {{ profile.location }}
        </p>

        <h1 id="hero-title" class="mt-6 font-serif text-display">
          <span class="block overflow-hidden pb-2"><span class="hero-line block" style="--d: 80ms">Moh. Zulkifli</span></span>
          <span class="block overflow-hidden pb-2"><span class="hero-line block italic text-ink-2" style="--d: 180ms">Katili</span></span>
        </h1>

        <p class="hero-in mt-8 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl" style="--d: 320ms">
          {{ profile.tagline }}
        </p>

        <p class="hero-in mt-4 font-mono text-sm text-ink-3" style="--d: 400ms">
          <span class="sr-only">I build {{ profile.typed.join(', ') }}.</span>
          <span aria-hidden="true">
            &gt; I build <span class="text-accent">{{ typed }}</span><span class="blink">█</span>
          </span>
        </p>

        <div class="hero-in mt-10 flex flex-wrap gap-3" style="--d: 480ms">
          <AppButton to="/work" icon="lucide:arrow-right" magnetic>
            View selected work
          </AppButton>
          <AppButton to="/about" variant="outline">
            About me
          </AppButton>
        </div>
      </div>

      <div class="hero-in md:col-span-4" style="--d: 260ms">
        <div class="pixel-frame relative ml-auto aspect-[4/5] w-2/3 max-w-sm overflow-hidden md:w-full">
          <div ref="portrait" class="absolute -inset-y-[8%] inset-x-0">
            <NuxtImg
              format="webp"
              :src="profile.portrait"
              alt="Portrait of Moh. Zulkifli Katili"
              sizes="xs:60vw md:33vw lg:400px"
              loading="eager"
              fetchpriority="high"
              class="h-full w-full object-cover object-[50%_20%] grayscale-[35%] transition duration-700 hover:grayscale-0"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hero intro is pure CSS so it runs before hydration and never hides the LCP element. */
.hero-line {
  animation: hero-line 1.1s var(--ease-out-expo) both;
  animation-delay: var(--d);
}
.hero-in {
  animation: hero-in 1s var(--ease-out-expo) both;
  animation-delay: var(--d);
}
@keyframes hero-line {
  from { transform: translateY(105%); }
}
@keyframes hero-in {
  from { opacity: 0; transform: translateY(16px); }
}
</style>

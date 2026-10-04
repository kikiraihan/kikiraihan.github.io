<script setup lang="ts">
const site = useSiteConfig()
const profile = computed(() => site.value.profile)
const { t } = useI18n()
const localePath = useLocalePath()
const { data: page } = await usePage('about')

usePageSeo({
  title: t('about.seoTitle'),
  description: page.value?.description ?? profile.value.description,
  type: 'profile',
})
</script>

<template>
  <div class="pt-16 md:pt-24">
    <div class="container-page grid gap-12 md:grid-cols-12">
      <div class="md:col-span-7">
        <p class="eyebrow">
          {{ $t('about.eyebrow') }}
        </p>
        <h1 class="mt-6 font-serif text-display">
          {{ $t('about.hi') }} <em class="text-accent">{{ profile.shortName }}.</em>
        </h1>
        <p class="mt-8 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl">
          {{ profile.description }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <AppButton :to="localePath('/contact')">
            {{ $t('about.getInTouch') }}
          </AppButton>
        </div>
      </div>
      <div class="md:col-span-4 md:col-start-9">
        <NuxtImg
          format="webp"
          :src="profile.avatar"
          :alt="profile.name"
          sizes="xs:80vw md:33vw lg:400px"
          loading="eager"
          class="aspect-[4/5] w-full rounded-lg object-cover"
        />
      </div>
    </div>

    <div class="container-page mt-24 grid gap-12 lg:grid-cols-12">
      <ContentRenderer v-if="page" :value="page" class="prose-page lg:col-span-8 lg:col-start-3" />
    </div>

    <section class="container-page mt-32" aria-labelledby="about-experience">
      <SectionHeading id="about-experience" :eyebrow="$t('about.experience')" :title="$t('about.experienceTitle')" />
      <ExperienceTimeline />
    </section>

    <section class="container-page mt-32" aria-labelledby="about-tools">
      <SectionHeading id="about-tools" :eyebrow="$t('about.capabilities')" :title="$t('about.capabilitiesTitle')" />
      <CapabilityGrid />
    </section>

    <ContactCta />
  </div>
</template>

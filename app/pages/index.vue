<script setup lang="ts">
const site = useSiteConfig()
const { profile, socials } = site.value
const { siteUrl } = useRuntimeConfig().public
const localePath = useLocalePath()

usePageSeo({
  title: profile.name,
  description: profile.description,
  type: 'profile',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': profile.name,
      'url': siteUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': profile.name,
      'alternateName': profile.shortName,
      'jobTitle': profile.role,
      'url': siteUrl,
      'image': `${siteUrl}${profile.portrait}`,
      'email': `mailto:${profile.email}`,
      'sameAs': socials.map(s => s.url),
    },
  ],
})
</script>

<template>
  <div>
    <HomeHero />
    <SelectedWork />

    <section class="container-page mt-32 md:mt-48" aria-labelledby="experience">
      <SectionHeading id="experience" index="02" :eyebrow="$t('home.experience')" :title="$t('home.experienceTitle')" />
      <ExperienceTimeline :limit="4" :filters="false" />
      <div class="mt-10">
        <AppButton :to="localePath('/about#about-experience')" variant="outline" icon="lucide:arrow-right">
          {{ $t('home.seeMore') }}
        </AppButton>
      </div>
    </section>

    <section class="container-page mt-32 md:mt-48" aria-labelledby="capabilities">
      <SectionHeading id="capabilities" index="03" :eyebrow="$t('home.capabilities')" :title="$t('home.capabilitiesTitle')">
        <p>
          {{ $t('home.capabilitiesText') }}
        </p>
      </SectionHeading>
      <CapabilityGrid />
    </section>

    <section class="container-page mt-32 md:mt-48" aria-labelledby="github-activity">
      <SectionHeading id="github-activity" index="04" :eyebrow="$t('home.github')" :title="$t('home.githubTitle')">
        <p>
          {{ $t('home.githubText') }}
        </p>
      </SectionHeading>
      <GitHubContributions />
    </section>

    <AboutPreview />
    <ContactCta />
  </div>
</template>

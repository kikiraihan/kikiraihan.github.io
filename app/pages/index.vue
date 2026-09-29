<script setup lang="ts">
const { profile, socials } = useAppConfig()
const { siteUrl } = useRuntimeConfig().public

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
      <SectionHeading id="experience" index="02" eyebrow="Experience" title="Where I've been building." />
      <ExperienceTimeline :limit="6" :filters="false" />
    </section>

    <section class="container-page mt-32 md:mt-48" aria-labelledby="capabilities">
      <SectionHeading id="capabilities" index="03" eyebrow="Capabilities" title="What I bring to a team.">
        <p>
          Grouped by what they let me do. Tools change; the ability to reason about systems, data and people doesn't.
        </p>
      </SectionHeading>
      <CapabilityGrid />
    </section>

    <AboutPreview />
    <ContactCta />
  </div>
</template>

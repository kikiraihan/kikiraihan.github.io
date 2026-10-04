<script setup lang="ts">
const { data: projects } = await useProjects('featured-projects', { featured: true })
const localePath = useLocalePath()
</script>

<template>
  <!-- hidden when nothing featured is left (e.g. a kind of work switched off in app.config.ts) -->
  <section v-if="projects?.length" class="container-page mt-24 md:mt-32" aria-labelledby="selected-work">
    <div class="mb-12 flex items-end justify-between gap-6 md:mb-16">
      <div>
        <p class="eyebrow">
          <span class="text-accent">01</span> / {{ $t('home.selectedWork') }}
        </p>
        <h2 id="selected-work" class="mt-4 max-w-3xl font-serif text-headline">
          {{ $t('home.selectedWorkTitle') }}
        </h2>
      </div>
      <NuxtLink :to="localePath('/work')" class="link-underline hidden shrink-0 text-sm md:inline">
        {{ $t('home.allProjects') }} →
      </NuxtLink>
    </div>

    <!-- Editorial, asymmetric grid: odd items are offset down on desktop -->
    <div class="grid gap-x-10 gap-y-16 md:grid-cols-12">
      <div
        v-for="(project, i) in projects"
        :key="project.path"
        v-reveal
        :class="i % 2 === 0 ? 'md:col-span-7' : 'md:col-span-5 md:mt-40'"
      >
        <ProjectCard :project="project" :size="i % 2 === 0 ? 'lg' : 'md'" />
      </div>
    </div>

    <div class="mt-16 md:hidden">
      <AppButton :to="localePath('/work')" variant="outline" icon="lucide:arrow-right">
        {{ $t('home.allProjects') }}
      </AppButton>
    </div>
  </section>
</template>

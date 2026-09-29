<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: project } = await useAsyncData(`project-${slug}`, () =>
  queryCollection('projects').path(`/projects/${slug}`).first(),
)

if (!project.value || project.value.draft) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const { data: all } = await useProjects('all-projects')
const next = computed(() => {
  const list = all.value ?? []
  const i = list.findIndex(p => p.path === project.value!.path)
  return list.length > 1 ? list[(i + 1) % list.length] : undefined
})

const { siteUrl } = useRuntimeConfig().public
usePageSeo({
  title: project.value.title,
  description: project.value.description ?? '',
  image: project.value.cover,
  type: 'article',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    'name': project.value.title,
    'description': project.value.description,
    'image': `${siteUrl}${project.value.cover}`,
    'dateCreated': String(project.value.year),
    'author': { '@type': 'Person', 'name': useAppConfig().profile.name },
    'keywords': (project.value.technologies ?? []).join(', '),
  },
})

const overview = computed(() => [
  { label: 'Role', value: project.value!.role },
  { label: 'Timeline', value: project.value!.timeline ?? String(project.value!.year) },
  { label: 'Context', value: project.value!.company },
].filter(i => i.value))
</script>

<template>
  <article v-if="project" class="pt-12 md:pt-20">
    <header class="container-page">
      <NuxtLink to="/work" class="eyebrow link-underline inline-flex items-center gap-1 hover:text-ink">
        <Icon name="lucide:arrow-left" class="size-3" aria-hidden="true" /> Work
      </NuxtLink>
      <p class="eyebrow mt-10 text-accent">
        {{ project.category }}
      </p>
      <h1 class="mt-4 max-w-5xl font-serif text-display">
        {{ project.title }}
      </h1>
      <p class="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2 md:text-xl">
        {{ project.description }}
      </p>

      <!-- 8.1 Overview -->
      <dl class="mt-12 grid gap-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in overview" :key="item.label">
          <dt class="eyebrow">
            {{ item.label }}
          </dt>
          <dd class="mt-1.5 text-sm">
            {{ item.value }}
          </dd>
        </div>
        <div>
          <dt class="eyebrow">
            Stack
          </dt>
          <dd class="mt-2">
            <TagList :tags="project.technologies" />
          </dd>
        </div>
      </dl>
    </header>

    <div class="container-page mt-12">
      <div class="overflow-hidden rounded-lg border border-line">
        <NuxtImg format="webp" :src="project.cover" :alt="`${project.title} cover`" sizes="xs:100vw lg:1280px" loading="eager" class="max-h-[80vh] w-full object-cover object-top" />
      </div>
    </div>

    <div class="container-page mt-16 grid gap-12 lg:grid-cols-12">
      <aside class="lg:col-span-3">
        <div class="space-y-8 lg:sticky lg:top-28">
          <!-- 8.8 Contribution: team vs. individual -->
          <section v-if="project.contribution" aria-labelledby="contribution">
            <h2 id="contribution" class="eyebrow mb-3">
              My contribution
            </h2>
            <p v-if="project.contribution.mine" class="text-sm leading-relaxed">
              {{ project.contribution.mine }}
            </p>
            <p v-if="project.contribution.team" class="mt-3 border-l-2 border-line pl-3 text-sm leading-relaxed text-ink-3">
              <span class="font-medium text-ink-2">Team:</span> {{ project.contribution.team }}
            </p>
          </section>
          <section v-if="project.links?.length" aria-labelledby="links">
            <h2 id="links" class="eyebrow mb-3">
              Links
            </h2>
            <ul class="space-y-2 text-sm">
              <li v-for="l in project.links" :key="l.url">
                <a :href="l.url" target="_blank" rel="noopener" class="link-underline inline-flex items-center gap-1">
                  {{ l.label }} <Icon name="lucide:arrow-up-right" class="size-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </section>
        </div>
      </aside>

      <ContentRenderer :value="project" class="prose-page lg:col-span-8 lg:col-start-5" />
    </div>

    <nav v-if="next" class="container-page mt-32" aria-label="Next project">
      <NuxtLink :to="`/work/${slugFromPath(next.path)}`" class="group block border-t border-line pt-10">
        <p class="eyebrow">
          Next project
        </p>
        <p class="mt-4 flex items-center gap-4 font-serif text-headline transition-colors group-hover:text-accent">
          {{ next.title }}
          <Icon name="lucide:arrow-right" class="size-8 transition-transform duration-500 group-hover:translate-x-2" aria-hidden="true" />
        </p>
      </NuxtLink>
    </nav>
  </article>
</template>

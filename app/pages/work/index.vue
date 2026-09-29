<script setup lang="ts">
usePageSeo({
  title: 'Work',
  description: 'Case studies in payments, backend systems, data, AI and knowledge graphs — plus brand and interface design.',
})

const route = useRoute()
const router = useRouter()
const { data: projects } = await useProjects('all-projects')

const filters = [
  { value: 'all', label: 'All' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
] as const
type Filter = (typeof filters)[number]['value']

// Filter lives in the URL (?type=design) so it is shareable and old /design links land here.
const active = computed<Filter>(() => {
  const t = route.query.type
  return t === 'engineering' || t === 'design' ? t : 'all'
})
const setFilter = (value: Filter) => router.replace({ query: value === 'all' ? {} : { type: value } })

const visible = computed(() =>
  (projects.value ?? []).filter(p => active.value === 'all' || p.type === active.value),
)
const count = (value: Filter) => (projects.value ?? []).filter(p => value === 'all' || p.type === value).length
</script>

<template>
  <div class="container-page pt-16 md:pt-24">
    <SectionHeading as="h1" eyebrow="Work" title="Things I've designed, built and shipped.">
      <p>Each project explains the problem, the constraints, what was built, and what I personally contributed.</p>
    </SectionHeading>

    <div class="mb-12 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
      <button
        v-for="f in filters"
        :key="f.value"
        type="button"
        class="rounded-full border px-4 py-1.5 text-sm transition-colors"
        :class="active === f.value ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink'"
        :aria-pressed="active === f.value"
        @click="setFilter(f.value)"
      >
        {{ f.label }} <span class="ml-1 font-mono text-xs opacity-60">{{ count(f.value) }}</span>
      </button>
    </div>

    <TransitionGroup
      tag="div"
      class="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
      move-class="transition duration-500"
      enter-active-class="transition duration-500"
      enter-from-class="opacity-0 translate-y-4"
      leave-active-class="hidden"
    >
      <ProjectCard v-for="(project, i) in visible" :key="project.path" :project="project" :eager="i < 3" />
    </TransitionGroup>
  </div>
</template>

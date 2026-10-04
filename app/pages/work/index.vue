<script setup lang="ts">
const { t } = useI18n()
usePageSeo({
  title: t('work.seoTitle'),
  description: t('work.seoDescription'),
})

const route = useRoute()
const router = useRouter()
const { data: projects } = await useProjects('all-projects')

const workTypes = useWorkTypes()
// labels are i18n keys (i18n/locales/*.json)
const allFilters = [
  { value: 'all', label: 'common.all' },
  { value: 'engineering', label: 'work.engineering' },
  { value: 'design', label: 'work.design' },
] as const
type Filter = (typeof allFilters)[number]['value']
// Kinds switched off in app.config.ts (`work`) get no button; with a single kind left the filter is hidden.
const filters = allFilters.filter(f => f.value === 'all' || workTypes.includes(f.value))

// Filter lives in the URL (?type=design) so it is shareable and old /design links land here.
const active = computed<Filter>(() => {
  const t = route.query.type
  return (t === 'engineering' || t === 'design') && workTypes.includes(t) ? t : 'all'
})
const setFilter = (value: Filter) => router.replace({ query: value === 'all' ? {} : { type: value } })

const visible = computed(() =>
  (projects.value ?? []).filter(p => active.value === 'all' || p.type === active.value),
)
const count = (value: Filter) => (projects.value ?? []).filter(p => value === 'all' || p.type === value).length
</script>

<template>
  <div class="container-page pt-16 md:pt-24">
    <SectionHeading as="h1" :eyebrow="$t('work.eyebrow')" :title="$t('work.title')">
      <p>{{ $t('work.intro') }}</p>
    </SectionHeading>

    <div v-if="filters.length > 2" class="mb-12 flex flex-wrap gap-2" role="group" :aria-label="$t('work.filter')">
      <button
        v-for="f in filters"
        :key="f.value"
        type="button"
        class="rounded-full border px-4 py-1.5 text-sm transition-colors"
        :class="active === f.value ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink'"
        :aria-pressed="active === f.value"
        @click="setFilter(f.value)"
      >
        {{ $t(f.label) }} <span class="ml-1 font-mono text-xs opacity-60">{{ count(f.value) }}</span>
      </button>
    </div>

    <TransitionGroup
      tag="div"
      :class="{ 'mt-12': filters.length <= 2 }"
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

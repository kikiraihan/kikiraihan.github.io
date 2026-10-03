<script setup lang="ts">
// Interactive career timeline: filter by kind, expand an entry for highlights.
const props = withDefaults(defineProps<{ limit?: number, filters?: boolean }>(), { limit: undefined, filters: true })
const { data } = await useExperience()
const { data: hiddenProjects } = await useHiddenProjectSlugs()

const kinds = [
  { value: 'all', label: 'All' },
  { value: 'work', label: 'Work' },
  { value: 'education', label: 'Education' },
  { value: 'organization', label: 'Organization' },
] as const
const kind = ref<(typeof kinds)[number]['value']>('all')
const expanded = ref<number | null>(0)
const uid = useId()

const items = computed(() => {
  const all = data.value?.items ?? []
  const filtered = kind.value === 'all' ? all : all.filter(i => i.kind === kind.value)
  return props.limit ? filtered.slice(0, props.limit) : filtered
})

// With a limit, the oldest entry is still shown after a "…" gap, so the timeline reads as
// spanning the whole career rather than just the latest few entries.
const startOf = (period: string) => {
  const year = Number(period.match(/\d{4}/)?.[0] ?? 9999)
  const month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    .indexOf(period.slice(0, 3).toLowerCase())
  return year * 12 + Math.max(month, 0)
}
const hiddenCount = computed(() => props.limit ? Math.max((data.value?.items.length ?? 0) - props.limit, 0) : 0)
const earliest = computed(() => {
  if (!hiddenCount.value) return null
  const rest = (data.value?.items ?? []).slice(props.limit)
  return rest.reduce((a, b) => (startOf(b.period) < startOf(a.period) ? b : a))
})
const shown = computed(() => earliest.value ? [...items.value, earliest.value] : items.value)
</script>

<template>
  <div>
    <div v-if="filters" class="mb-6 flex gap-1" role="group" aria-label="Filter timeline">
      <button
        v-for="k in kinds"
        :key="k.value"
        type="button"
        class="rounded-full border px-3 py-1 text-xs transition-colors"
        :class="kind === k.value ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink'"
        :aria-pressed="kind === k.value"
        @click="kind = k.value; expanded = null"
      >
        {{ k.label }}
      </button>
    </div>

    <ol class="relative border-l border-line">
      <template v-for="(item, i) in shown" :key="`${item.company}-${item.period}`">
      <li v-if="earliest && i === items.length" class="relative py-6 pl-6 md:pl-10" aria-hidden="true">
        <!-- gap marker: breaks the line with "⋮" to show skipped entries -->
        <span class="absolute -left-[2px] inset-y-0 w-[3px] bg-paper" />
        <span class="absolute -left-[2px] top-1/2 flex -translate-y-1/2 flex-col gap-1">
          <span v-for="d in 3" :key="d" class="size-[3px] rounded-full bg-ink-3" />
        </span>
        <span class="font-mono text-xs text-ink-3">+{{ hiddenCount - 1 }} more</span>
      </li>
      <li class="relative pl-6 md:pl-10">
        <span
          class="absolute -left-[5px] top-7 size-[9px] rounded-full border transition-colors"
          :class="expanded === i ? 'border-accent bg-accent' : 'border-ink-3 bg-paper'"
          aria-hidden="true"
        />
        <button
          type="button"
          class="grid w-full gap-1 border-b border-line py-5 text-left md:grid-cols-12 md:gap-6"
          :aria-expanded="expanded === i"
          :aria-controls="`${uid}-${i}`"
          @click="expanded = expanded === i ? null : i"
        >
          <span class="font-mono text-xs text-ink-3 md:col-span-3 md:pt-2">{{ item.period }}</span>
          <span class="md:col-span-8">
            <span class="block font-serif text-2xl leading-tight md:text-3xl">{{ item.company }}</span>
            <span class="mt-1 block text-sm text-ink-2">{{ item.role }}</span>
          </span>
          <Icon
            name="lucide:plus"
            class="hidden size-4 justify-self-end text-ink-3 transition-transform duration-300 md:col-span-1 md:mt-3 md:block"
            :class="{ 'rotate-45 text-accent': expanded === i }"
            aria-hidden="true"
          />
        </button>
        <div
          :id="`${uid}-${i}`"
          class="grid transition-[grid-template-rows] duration-500 ease-out"
          :class="expanded === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
          <div class="overflow-hidden" :inert="expanded !== i">
            <div class="grid gap-3 pb-6 pt-4 md:grid-cols-12 md:gap-6">
              <div class="text-sm leading-relaxed text-ink-2 md:col-span-8 md:col-start-4">
                <p class="text-ink">
                  {{ item.summary }}
                </p>
                <ul v-if="item.highlights?.length" class="mt-3 space-y-1.5">
                  <li v-for="h in item.highlights" :key="h" class="flex gap-2">
                    <span class="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />{{ h }}
                  </li>
                </ul>
                <NuxtLink v-if="item.project && !hiddenProjects.includes(item.project)" :to="`/work/${item.project}`" class="link-underline mt-4 inline-flex items-center gap-1 text-ink">
                  Read the case study <Icon name="lucide:arrow-right" class="size-3.5" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </li>
      </template>
      <li v-if="$slots.footer" class="relative pl-6 pt-8 md:pl-10">
        <span class="absolute -left-[5px] top-1/2 mt-4 size-[9px] -translate-y-1/2 rounded-full border border-ink-3 bg-ink-3" aria-hidden="true" />
        <slot name="footer" />
      </li>
    </ol>
  </div>
</template>

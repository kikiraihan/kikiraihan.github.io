<script setup lang="ts">
// GitHub contribution graph (last 12 months). Data is prerendered at build time by
// server/routes/github-contributions.json.ts; cell colors come from the theme (.contrib-cell[data-level]).
interface ContributionDay { date: string, count: number, level: 0 | 1 | 2 | 3 | 4 }

const { github, socials } = useAppConfig()
const profileUrl = socials.find(s => s.label === 'GitHub')?.url ?? `https://github.com/${github.username}`

const { data } = await useFetch('/github-contributions.json', { key: 'github-contributions' })
const days = ref<ContributionDay[]>(data.value?.contributions ?? [])
const total = ref<number | null>(data.value?.total ?? null)
const scroller = ref<HTMLElement>()

onMounted(async () => {
  // Build-time fetch failed (e.g. offline CI): try once from the browser.
  if (!days.value.length) {
    try {
      const live = await $fetch<{ total: Record<string, number>, contributions: ContributionDay[] }>(
        `https://github-contributions-api.jogruber.de/v4/${github.username}`,
        { query: { y: 'last' } },
      )
      days.value = live.contributions
      total.value = live.total?.lastYear ?? null
    }
    catch {
      // keep the empty state
    }
  }
  // Most recent weeks are on the right: show them first on narrow screens.
  await nextTick()
  if (scroller.value) scroller.value.scrollLeft = scroller.value.scrollWidth
})

const dayOf = (date: string) => new Date(`${date}T00:00:00Z`)
const fmt = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const monthFmt = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })

// Columns = weeks (Sunday first), like GitHub; the first week is padded with empty cells.
const weeks = computed(() => {
  const out: (ContributionDay | null)[][] = []
  if (!days.value.length) return out
  let week: (ContributionDay | null)[] = Array.from({ length: dayOf(days.value[0]!.date).getUTCDay() }, () => null)
  for (const d of days.value) {
    week.push(d)
    if (week.length === 7) {
      out.push(week)
      week = []
    }
  }
  if (week.length) out.push(week)
  return out
})

// Month label above the first week that starts in a new month.
const months = computed(() => weeks.value.map((week, i) => {
  const first = week.find(Boolean)
  if (!first) return ''
  const m = dayOf(first.date).getUTCMonth()
  const prev = weeks.value[i - 1]?.find(Boolean)
  // a partial first week right before a month change would overlap the next label
  const next = weeks.value[i + 1]?.find(Boolean)
  if (i === 0 && next && dayOf(next.date).getUTCMonth() !== m) return ''
  return !prev || dayOf(prev.date).getUTCMonth() !== m ? monthFmt.format(dayOf(first.date)) : ''
}))

const stats = computed(() => {
  let longest = 0
  let run = 0
  let best: ContributionDay | null = null
  for (const d of days.value) {
    run = d.count > 0 ? run + 1 : 0
    longest = Math.max(longest, run)
    if (!best || d.count > best.count) best = d
  }
  const activeDays = days.value.filter(d => d.count > 0).length
  return { longest, best, activeDays }
})

const label = (d: ContributionDay) =>
  `${d.count === 0 ? 'No' : d.count} contribution${d.count === 1 ? '' : 's'} on ${fmt.format(dayOf(d.date))}`
</script>

<template>
  <div>
    <div v-if="weeks.length" v-reveal class="rounded-2xl border border-line p-4 sm:p-6">
      <div class="mb-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <p class="text-sm text-ink-2">
          <span class="font-serif text-2xl text-ink">{{ total?.toLocaleString('en') ?? '—' }}</span>
          contributions in the last year
        </p>
        <dl class="flex gap-6 text-xs text-ink-3">
          <div>
            <dt>Active days</dt>
            <dd class="mt-0.5 text-sm font-medium text-ink">
              {{ stats.activeDays }}
            </dd>
          </div>
          <div>
            <dt>Longest streak</dt>
            <dd class="mt-0.5 text-sm font-medium text-ink">
              {{ stats.longest }} day{{ stats.longest === 1 ? '' : 's' }}
            </dd>
          </div>
          <div v-if="stats.best?.count">
            <dt>Busiest day</dt>
            <dd class="mt-0.5 text-sm font-medium text-ink">
              {{ stats.best.count }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- Only the graph scrolls horizontally on small screens, never the page -->
      <div ref="scroller" class="-mx-1 overflow-x-auto px-1 pb-1 [--cell:11px] md:[--cell:14px]">
        <div class="inline-block" role="img" :aria-label="`GitHub contribution graph: ${total ?? 'several'} contributions in the last year.`">
          <div class="mb-1.5 grid grid-flow-col auto-cols-[var(--cell)] gap-[3px] text-[10px] leading-none text-ink-3" aria-hidden="true">
            <span v-for="(m, i) in months" :key="i" class="overflow-visible whitespace-nowrap">{{ m }}</span>
          </div>
          <div class="grid grid-flow-col grid-rows-7 auto-cols-[var(--cell)] gap-[3px]" aria-hidden="true">
            <template v-for="(week, w) in weeks" :key="w">
              <span
                v-for="(d, i) in week"
                :key="d?.date ?? `pad-${w}-${i}`"
                class="size-[var(--cell)]"
                :class="d ? 'contrib-cell' : ''"
                :data-level="d?.level"
                :title="d ? label(d) : undefined"
              />
            </template>
          </div>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-3">
        <a :href="profileUrl" target="_blank" rel="noopener" class="link-underline inline-flex items-center gap-1.5 hover:text-ink">
          <Icon name="simple-icons:github" class="size-3.5" aria-hidden="true" />@{{ github.username }}
        </a>
        <span class="inline-flex items-center gap-1" aria-hidden="true">
          Less
          <span v-for="l in 5" :key="l" class="contrib-cell size-[11px]" :data-level="l - 1" />
          More
        </span>
      </div>
    </div>

    <!-- Empty state: data could not be fetched at build time or in the browser -->
    <div v-else class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line p-6 text-sm text-ink-2">
      <p>The contribution graph is unavailable right now.</p>
      <AppButton :href="profileUrl" variant="outline" icon="lucide:arrow-up-right">
        View on GitHub
      </AppButton>
    </div>
  </div>
</template>

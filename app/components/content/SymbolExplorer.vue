<script setup lang="ts">
// Icon / symbol set explorer for design case studies: a grid of symbols; selecting one shows it large
// with its meaning. Keyboard: Tab/Enter, or arrow keys inside the grid (same pattern as ArchitectureExplorer).
const props = defineProps<{
  items: { src: string, label: string, meaning: string }[]
  caption?: string
}>()
const active = ref(0)
const uid = useId()
const current = computed(() => props.items[active.value])
const buttons = ref<HTMLButtonElement[]>([])

function onKey(e: KeyboardEvent, i: number) {
  const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? i - 1 : null
  if (next === null) return
  e.preventDefault()
  const idx = (next + props.items.length) % props.items.length
  active.value = idx
  buttons.value[idx]?.focus()
}
</script>

<template>
  <figure class="not-prose my-10 overflow-hidden rounded-lg border border-line bg-paper-2/60">
    <div class="grid md:grid-cols-5">
      <div
        :id="`${uid}-detail`"
        class="flex flex-col items-center justify-center gap-5 border-b border-line p-6 text-center md:col-span-2 md:border-b-0 md:border-r md:p-8"
        aria-live="polite"
      >
        <Transition mode="out-in" enter-active-class="transition duration-300" enter-from-class="opacity-0 scale-95" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <div v-if="current" :key="current.src" class="flex flex-col items-center">
            <!-- symbols are drawn on white, so they sit on a white tile in dark mode too -->
            <span class="grid size-32 place-items-center rounded-full border border-line bg-white md:size-40">
              <NuxtImg format="webp" :src="current.src" :alt="current.label" class="size-24 object-contain md:size-28" />
            </span>
            <p class="mt-5 font-serif text-2xl leading-tight">
              {{ current.label }}
            </p>
            <p class="mt-3 max-w-xs text-sm leading-relaxed text-ink-2">
              {{ current.meaning }}
            </p>
          </div>
        </Transition>
      </div>
      <ul class="grid grid-cols-3 gap-2 p-4 sm:grid-cols-4 md:col-span-3 md:p-6" aria-label="Symbols">
        <li v-for="(item, i) in items" :key="item.src">
          <button
            ref="buttons"
            type="button"
            class="flex h-full w-full flex-col items-center gap-2 rounded-md border p-3 text-center text-[11px] leading-tight transition-all duration-300"
            :class="active === i ? 'border-ink bg-paper shadow-lg' : 'border-transparent hover:border-line'"
            :aria-pressed="active === i"
            :aria-controls="`${uid}-detail`"
            @click="active = i"
            @keydown="onKey($event, i)"
          >
            <span class="grid size-14 place-items-center rounded-full bg-white">
              <NuxtImg format="webp" :src="item.src" alt="" class="size-11 object-contain" />
            </span>
            <span :class="active === i ? 'text-ink' : 'text-ink-2'">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </div>
    <figcaption class="border-t border-line px-5 py-3 text-xs text-ink-3 md:px-8">
      {{ caption ?? 'Select a symbol to read what it stands for.' }}
    </figcaption>
  </figure>
</template>

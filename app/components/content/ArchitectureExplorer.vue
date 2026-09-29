<script setup lang="ts">
// Interactive system diagram: each layer is a button; selecting one reveals what it does.
// Works with keyboard (Tab/Enter, or arrow keys inside the list) and without hover.
const props = defineProps<{ nodes: { id: string, label: string, detail?: string }[] }>()
const active = ref(props.nodes[0]?.id)
const uid = useId()
const current = computed(() => props.nodes.find(n => n.id === active.value))
const buttons = ref<HTMLButtonElement[]>([])

function onKey(e: KeyboardEvent, i: number) {
  const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? i - 1 : null
  if (next === null) return
  e.preventDefault()
  const idx = (next + props.nodes.length) % props.nodes.length
  active.value = props.nodes[idx]!.id
  buttons.value[idx]?.focus()
}
</script>

<template>
  <figure class="not-prose my-10 overflow-hidden rounded-lg border border-line bg-paper-2/60">
    <div class="grid md:grid-cols-5">
      <ol class="relative p-5 md:col-span-3 md:p-8" aria-label="System layers">
        <li v-for="(node, i) in nodes" :key="node.id" class="relative">
          <button
            ref="buttons"
            type="button"
            class="relative z-10 flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-all duration-300"
            :class="active === node.id
              ? 'border-ink bg-ink text-paper shadow-lg'
              : 'border-line bg-paper text-ink hover:border-ink/50'"
            :aria-pressed="active === node.id"
            :aria-controls="`${uid}-detail`"
            @click="active = node.id"
            @keydown="onKey($event, i)"
          >
            <span class="font-mono text-[11px] opacity-60">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="font-medium">{{ node.label }}</span>
          </button>
          <div v-if="i < nodes.length - 1" class="ml-8 flex h-6 items-center" aria-hidden="true">
            <span class="h-full w-px bg-line" />
            <Icon name="lucide:chevron-down" class="-ml-[7.5px] mt-3 size-3.5 text-ink-3" />
          </div>
        </li>
      </ol>
      <div
        :id="`${uid}-detail`"
        class="border-t border-line p-5 md:col-span-2 md:border-l md:border-t-0 md:p-8"
        aria-live="polite"
      >
        <p class="eyebrow mb-3">
          Layer detail
        </p>
        <Transition mode="out-in" enter-active-class="transition duration-300" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <div v-if="current" :key="current.id">
            <p class="font-serif text-2xl leading-tight">
              {{ current.label }}
            </p>
            <p v-if="current.detail" class="mt-3 text-sm leading-relaxed text-ink-2">
              {{ current.detail }}
            </p>
          </div>
        </Transition>
      </div>
    </div>
    <figcaption class="border-t border-line px-5 py-3 text-xs text-ink-3 md:px-8">
      Simplified architecture — select a layer to inspect it.
    </figcaption>
  </figure>
</template>

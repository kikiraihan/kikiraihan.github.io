<script setup lang="ts">
// Brand palette swatches for design case studies. The hex values are content (a client's brand colors),
// so they are inline styles here — everything around them still uses theme tokens.
// Selecting a swatch copies its hex code.
defineProps<{ colors: { hex: string, name: string, role?: string }[] }>()
const copied = ref<string | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy(hex: string) {
  try {
    await navigator.clipboard.writeText(hex)
    copied.value = hex
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = null), 1400)
  }
  catch {
    // clipboard unavailable (e.g. insecure context) — the hex is visible anyway
  }
}
</script>

<template>
  <ul class="not-prose my-10 grid grid-cols-2 gap-3 sm:grid-cols-4" :aria-label="$t('content.colorPalette')">
    <li v-for="(c, i) in colors" :key="`${c.hex}-${c.name}`" v-reveal="{ delay: (i % 4) * 0.06 }">
      <button
        type="button"
        class="group block h-full w-full overflow-hidden rounded-lg border border-line bg-paper text-left transition-colors hover:border-ink"
        :aria-label="$t('content.copyHex', { name: c.name, hex: c.hex })"
        @click="copy(c.hex)"
      >
        <span class="relative block aspect-[4/3] border-b border-line" :style="{ backgroundColor: c.hex }">
          <span
            class="absolute right-2 top-2 rounded-full bg-paper px-2 py-0.5 font-mono text-[10px] text-ink transition-opacity"
            :class="copied === c.hex ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'"
            aria-hidden="true"
          >{{ copied === c.hex ? $t('common.copied') : $t('common.copy') }}</span>
        </span>
        <span class="block p-3">
          <span class="block text-sm font-medium text-ink">{{ c.name }}</span>
          <span class="mt-0.5 block font-mono text-xs uppercase text-ink-3">{{ c.hex }}</span>
          <span v-if="c.role" class="mt-1.5 block text-xs leading-relaxed text-ink-2">{{ c.role }}</span>
        </span>
      </button>
    </li>
  </ul>
  <p class="sr-only" aria-live="polite">
    {{ copied ? $t('content.copiedHex', { hex: copied }) : '' }}
  </p>
</template>

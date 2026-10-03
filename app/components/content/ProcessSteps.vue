<script setup lang="ts">
// Numbered design-process / breakdown steps for case studies.
defineProps<{ steps: { title: string, text: string }[] }>()
</script>

<template>
  <!-- revealed as one block: per-item motion would expose the hairline grid background mid-animation -->
  <ol v-reveal class="not-prose my-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
    <li v-for="(step, i) in steps" :key="step.title" class="bg-paper p-6">
      <span class="font-mono text-xs text-accent">{{ String(i + 1).padStart(2, '0') }}</span>
      <p class="mt-3 font-serif text-2xl leading-tight">
        {{ step.title }}
      </p>
      <p class="mt-2 text-sm leading-relaxed text-ink-2">
        {{ step.text }}
      </p>
    </li>
  </ol>
</template>

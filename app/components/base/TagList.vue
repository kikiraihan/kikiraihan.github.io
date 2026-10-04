<script setup lang="ts">
withDefaults(defineProps<{ tags?: string[], label?: string }>(), { tags: () => [], label: undefined })
</script>

<template>
  <ul class="flex flex-wrap gap-1.5" :aria-label="label ?? $t('content.technologies')">
    <li
      v-for="tag in tags"
      :key="tag"
      class="tag py-0.5 font-mono text-[11px] text-ink-2"
    >
      {{ tag }}
    </li>
  </ul>
</template>

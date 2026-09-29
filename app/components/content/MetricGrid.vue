<script setup lang="ts">
defineProps<{ metrics: { value: string, label: string }[] }>()
</script>

<template>
  <dl class="not-prose my-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
    <div v-for="m in metrics" :key="m.label" class="bg-paper p-6">
      <dt class="sr-only">
        {{ m.label }}
      </dt>
      <dd>
        <MetricCounter :value="m.value" class="block font-serif text-5xl leading-none" />
        <span class="mt-3 block text-sm text-ink-2">{{ m.label }}</span>
      </dd>
    </div>
  </dl>
</template>

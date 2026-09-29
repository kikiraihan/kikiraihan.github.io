<script setup lang="ts">
defineProps<{ index?: string, eyebrow: string, title: string, as?: 'h1' | 'h2', id?: string }>()
</script>

<template>
  <div v-reveal class="mb-12 grid gap-4 md:mb-16 md:grid-cols-12">
    <p class="eyebrow md:col-span-3">
      <span v-if="index" class="text-accent">{{ index }}</span>
      <span v-if="index"> / </span>{{ eyebrow }}
    </p>
    <component :is="as ?? 'h2'" :id="id" class="font-serif text-headline md:col-span-9">
      {{ title }}
    </component>
    <div v-if="$slots.default" class="text-ink-2 md:col-span-6 md:col-start-4">
      <slot />
    </div>
  </div>
</template>

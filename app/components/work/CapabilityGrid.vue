<script setup lang="ts">
const site = useSiteConfig()
</script>

<template>
  <div class="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
    <section v-for="(s, i) in site.skills" :key="s.group" v-reveal="{ delay: (i % 3) * 0.06 }" class="bg-paper p-6 md:p-8">
      <p class="font-mono text-xs text-accent">
        {{ String(i + 1).padStart(2, '0') }}
      </p>
      <h3 class="mt-3 font-serif text-3xl">
        {{ s.group }}
      </h3>
      <p class="mt-1 text-sm text-ink-3">
        {{ s.note }}
      </p>
      <ul class="mt-5 space-y-1 text-sm text-ink-2">
        <li v-for="item in s.items" :key="item">
          {{ item }}
        </li>
      </ul>
    </section>
  </div>
</template>

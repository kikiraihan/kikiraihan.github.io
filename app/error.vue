<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
useSeoMeta({ title: `${props.error.statusCode} — Moh. Zulkifli Katili`, robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <div class="container-page py-32">
      <p class="eyebrow text-accent">
        Error {{ error.statusCode }}
      </p>
      <h1 class="mt-6 font-serif text-display">
        {{ error.statusCode === 404 ? 'Nothing here.' : 'Something broke.' }}
      </h1>
      <p class="mt-6 max-w-lg text-ink-2">
        {{ error.statusCode === 404 ? "The page you're looking for moved or never existed." : error.message }}
      </p>
      <div class="mt-10">
        <AppButton to="/" icon="lucide:arrow-right" @click="clearError({ redirect: '/' })">
          Back home
        </AppButton>
      </div>
    </div>
  </NuxtLayout>
</template>

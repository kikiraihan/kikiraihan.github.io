<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const localePath = useLocalePath()
useSeoMeta({ title: `${props.error.statusCode} — Moh. Zulkifli Katili`, robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <div class="container-page py-32">
      <p class="eyebrow text-accent">
        {{ $t('error.label', { code: error.statusCode }) }}
      </p>
      <h1 class="mt-6 font-serif text-display">
        {{ error.statusCode === 404 ? $t('error.notFoundTitle') : $t('error.brokeTitle') }}
      </h1>
      <p class="mt-6 max-w-lg text-ink-2">
        {{ error.statusCode === 404 ? $t('error.notFoundText') : error.message }}
      </p>
      <div class="mt-10">
        <AppButton :to="localePath('/')" icon="lucide:arrow-right" @click="clearError({ redirect: localePath('/') })">
          {{ $t('error.backHome') }}
        </AppButton>
      </div>
    </div>
  </NuxtLayout>
</template>

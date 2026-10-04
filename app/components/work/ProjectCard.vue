<script setup lang="ts">
// every language shares one schema, so the English collection's item type stands for all of them
import type { ProjectsEnCollectionItem as ProjectsCollectionItem } from '@nuxt/content'

const props = defineProps<{ project: ProjectsCollectionItem, size?: 'lg' | 'md', eager?: boolean }>()
const slug = computed(() => slugFromPath(props.project.path))
const localePath = useLocalePath()
const metric = computed(() => props.project.metrics?.[0])
</script>

<template>
  <article class="group relative">
    <div class="card-frame relative overflow-hidden bg-paper-2">
      <NuxtImg
        format="webp"
        :src="project.cover"
        :alt="''"
        sizes="xs:100vw md:50vw lg:700px"
        :loading="eager ? 'eager' : 'lazy'"
        class="w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        :class="size === 'lg' ? 'aspect-[4/3]' : 'aspect-[16/11]'"
      />
      <div
        v-if="metric"
        class="metric-badge absolute bottom-3 left-3 px-3 py-2 transition-transform duration-500 group-hover:-translate-y-1"
      >
        <p class="font-serif text-2xl leading-none">
          {{ metric.value }}
        </p>
        <p class="mt-1 max-w-[16rem] text-[11px] text-ink-2">
          {{ metric.label }}
        </p>
      </div>
    </div>
    <div class="mt-4 flex items-start justify-between gap-4">
      <div>
        <p class="eyebrow">
          {{ project.category }} · {{ project.year }}
        </p>
        <h3 class="mt-1.5 font-serif text-3xl leading-tight">
          <!-- whole card is clickable via the stretched link -->
          <NuxtLink :to="localePath(`/work/${slug}`)" class="after:absolute after:inset-0 after:content-['']">
            {{ project.title }}
          </NuxtLink>
        </h3>
        <p class="mt-2 max-w-prose text-sm leading-relaxed text-ink-2">
          {{ project.description }}
        </p>
      </div>
      <Icon
        name="lucide:arrow-up-right"
        class="mt-7 size-5 shrink-0 text-ink-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        aria-hidden="true"
      />
    </div>
  </article>
</template>

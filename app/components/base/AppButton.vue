<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  variant?: 'solid' | 'outline' | 'ghost'
  icon?: string
  magnetic?: boolean
}>(), { to: undefined, href: undefined, variant: 'solid', icon: undefined })

const classes = computed(() => [
  'group inline-flex items-center gap-2 px-5 py-3 font-pixel text-sm uppercase',
  {
    solid: 'pixel-box bg-accent text-accent-ink hover:bg-ink hover:text-paper',
    outline: 'pixel-box bg-paper text-ink hover:bg-accent-2 hover:text-ink',
    ghost: 'text-ink transition-colors duration-300 hover:text-accent',
  }[props.variant],
])
const external = computed(() => !!props.href && /^https?:/.test(props.href))
</script>

<template>
  <NuxtLink v-if="to" v-magnetic="magnetic" :to="to" :class="classes">
    <slot />
    <Icon v-if="icon" :name="icon" class="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
  </NuxtLink>
  <a v-else :href="href" :class="classes" :target="external ? '_blank' : undefined" :rel="external ? 'noopener' : undefined">
    <slot />
    <Icon v-if="icon" :name="icon" class="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
  </a>
</template>

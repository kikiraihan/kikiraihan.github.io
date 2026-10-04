<script setup lang="ts">
const { isDark, toggle } = useColorScheme()
</script>

<template>
  <button
    type="button"
    class="group grid size-10 place-items-center rounded-full hover:bg-paper-2"
    :aria-pressed="isDark"
    @click="toggle"
  >
    <span class="sr-only">{{ $t('common.darkMode') }}</span>
    <Icon
      :name="isDark ? 'lucide:sun' : 'lucide:moon'"
      class="size-[18px] transition-transform duration-300 group-hover:rotate-[20deg]"
      aria-hidden="true"
    />
  </button>
</template>

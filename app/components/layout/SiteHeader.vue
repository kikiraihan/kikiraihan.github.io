<script setup lang="ts">
const { nav, profile } = useAppConfig()
const route = useRoute()
const open = ref(false)

watch(() => route.fullPath, () => { open.value = false })

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)
</script>

<template>
  <header class="site-header sticky top-0 z-40 backdrop-blur-md">
    <nav class="container-page flex h-16 items-center justify-between" aria-label="Main">
      <NuxtLink to="/" class="group flex items-baseline gap-2" :aria-label="`${profile.name}, home`">
        <span class="font-serif text-2xl leading-none">Kiki</span>
        <span class="eyebrow hidden transition-colors group-hover:text-accent sm:inline">Katili</span>
      </NuxtLink>

      <div class="flex items-center gap-1">
        <ul class="hidden items-center gap-1 md:flex">
          <li v-for="item in nav" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="nav-link px-3 py-1.5 transition-colors hover:text-accent"
              :class="isActive(item.to) ? 'text-ink' : 'text-ink-2'"
              :aria-current="isActive(item.to) ? 'page' : undefined"
            >
              <!-- the active-page marker (dot / arrow) is drawn by the theme via [aria-current]::before/::after -->
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
        <ThemeToggle />
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full hover:bg-paper-2 md:hidden"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          @click="open = !open"
        >
          <span class="sr-only">{{ open ? 'Close menu' : 'Open menu' }}</span>
          <Icon :name="open ? 'lucide:x' : 'lucide:menu'" class="size-5" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <!-- Mobile: full-width, large-type menu rather than a shrunken desktop nav -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="open" id="mobile-menu" class="border-t border-line bg-paper md:hidden">
        <ul class="container-page py-6">
          <li v-for="(item, i) in nav" :key="item.to" class="border-b border-line last:border-0">
            <NuxtLink
              :to="item.to"
              class="flex items-baseline justify-between py-4 font-serif text-4xl"
              :aria-current="isActive(item.to) ? 'page' : undefined"
            >
              {{ item.label }}
              <span class="eyebrow">0{{ i + 1 }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>

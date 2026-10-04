<script setup lang="ts">
// Counts up the numeric part of a metric ("7,394", "20+", "< 2 mo") when it enters the viewport.
// Values are always written with a comma as the thousands separator (in every language's content);
// grouped numbers are shown in the current language's format (7,394 → 7.394 in Indonesian).
const props = defineProps<{ value: string }>()
const el = ref<HTMLElement>()
const { locale } = useI18n()

const parsed = computed(() => {
  const m = props.value.match(/^([^\d]*)([\d][\d,.]*)(.*)$/)
  if (!m) return null
  const num = Number(m[2]!.replace(/,/g, ''))
  return Number.isFinite(num) ? { prefix: m[1]!, num, suffix: m[3]!, grouped: m[2]!.includes(',') } : null
})

const format = (n: number) => {
  const p = parsed.value!
  const rounded = Math.round(n)
  return `${p.prefix}${p.grouped ? rounded.toLocaleString(locale.value) : rounded}${p.suffix}`
}

const display = computed(() => (parsed.value?.grouped ? format(parsed.value.num) : props.value))

onMounted(() => {
  if (!parsed.value || !el.value || !motionAllowed()) return
  const target = el.value
  const io = new IntersectionObserver(async ([entry]) => {
    if (!entry?.isIntersecting) return
    io.disconnect()
    const gsap = await loadGsap()
    const state = { n: 0 }
    target.textContent = format(0)
    gsap.to(state, {
      n: parsed.value!.num,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => { target.textContent = format(state.n) },
    })
  }, { threshold: 0.6 })
  io.observe(target)
})
</script>

<template>
  <!-- SSR renders the final value, so it is correct without JS and for screen readers -->
  <span ref="el" class="tabular-nums">{{ display }}</span>
</template>

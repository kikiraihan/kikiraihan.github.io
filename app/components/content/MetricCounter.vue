<script setup lang="ts">
// Counts up the numeric part of a metric ("7,394", "20+", "< 2 mo") when it enters the viewport.
const props = defineProps<{ value: string }>()
const el = ref<HTMLElement>()

const parsed = computed(() => {
  const m = props.value.match(/^([^\d]*)([\d][\d,.]*)(.*)$/)
  if (!m) return null
  const num = Number(m[2]!.replace(/,/g, ''))
  return Number.isFinite(num) ? { prefix: m[1]!, num, suffix: m[3]!, grouped: m[2]!.includes(',') } : null
})

const format = (n: number) => {
  const p = parsed.value!
  const rounded = Math.round(n)
  return `${p.prefix}${p.grouped ? rounded.toLocaleString('en-US') : rounded}${p.suffix}`
}

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
  <span ref="el" class="tabular-nums">{{ value }}</span>
</template>

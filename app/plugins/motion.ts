// Motion directives. Registered on server too (so SSR knows them), animated on client only.
//   v-reveal            fade/slide in when entering the viewport (optional { delay })
//   v-magnetic          element follows the pointer slightly (fine pointers only; v-magnetic="false" disables)
import type { Directive } from 'vue'

type RevealValue = { delay?: number } | undefined

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | undefined

  const reveal: Directive<HTMLElement, RevealValue> = {
    getSSRProps: () => ({ 'data-reveal': '' }),
    mounted(el, binding) {
      el.setAttribute('data-reveal', '')
      if (!document.documentElement.classList.contains('js-motion')) return

      observer ??= new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          observer!.unobserve(target)
          loadGsap().then(gsap => gsap.to(target, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            delay: Number(target.dataset.revealDelay ?? 0),
            clearProps: 'transform',
          }))
        }
      }, { rootMargin: '0px 0px -10% 0px' })

      if (binding.value?.delay) el.dataset.revealDelay = String(binding.value.delay)
      observer.observe(el)
    },
    beforeUnmount(el) {
      observer?.unobserve(el)
    },
  }

  const magnetic: Directive<HTMLElement, boolean | undefined> = {
    mounted(el, binding) {
      if (binding.value === false) return
      if (!motionAllowed() || !window.matchMedia('(pointer: fine)').matches) return
      let cleanup = () => {}
      loadGsap().then((gsap) => {
        const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
        const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          x((e.clientX - (r.left + r.width / 2)) * 0.25)
          y((e.clientY - (r.top + r.height / 2)) * 0.35)
        }
        const leave = () => { x(0); y(0) }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        cleanup = () => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        }
      })
      ;(el as HTMLElement & { _magneticCleanup?: () => void })._magneticCleanup = () => cleanup()
    },
    beforeUnmount(el) {
      (el as HTMLElement & { _magneticCleanup?: () => void })._magneticCleanup?.()
    },
  }

  nuxtApp.vueApp.directive('reveal', reveal)
  nuxtApp.vueApp.directive('magnetic', magnetic)
})

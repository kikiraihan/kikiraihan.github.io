import type { gsap as GSAP } from 'gsap'

let gsapPromise: Promise<typeof GSAP> | null = null
let scrollTriggerPromise: Promise<typeof GSAP> | null = null

/** GSAP is loaded lazily on the client so it never blocks first paint. */
export function loadGsap() {
  gsapPromise ??= import('gsap').then(m => m.gsap)
  return gsapPromise
}

export function loadScrollTrigger() {
  scrollTriggerPromise ??= Promise.all([loadGsap(), import('gsap/ScrollTrigger')]).then(([gsap, m]) => {
    gsap.registerPlugin(m.ScrollTrigger)
    return gsap
  })
  return scrollTriggerPromise
}

/** True when motion is allowed (client only; always false on the server). */
export function motionAllowed() {
  if (import.meta.server) return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

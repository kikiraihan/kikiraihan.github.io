<script setup lang="ts">
// Native <dialog>: Esc to close, focus is trapped and restored by the browser.
// Zoom: pinch (touch), wheel / trackpad pinch (desktop), double-tap or double-click to toggle,
// drag to pan while zoomed. Plain pointer events, no dependency.
const { current, close } = useLightbox()
const dialog = ref<HTMLDialogElement>()
const img = ref<HTMLImageElement>()

const MIN = 1
const MAX = 5
const DOUBLE_TAP_ZOOM = 2.5

const scale = ref(1)
const tx = ref(0)
const ty = ref(0)
const animate = ref(false) // smooth transition for discrete zooms (double-tap), not while dragging
const zoomed = computed(() => scale.value > 1.01)

watch(current, (image) => {
  if (!dialog.value) return
  reset(false)
  if (image && !dialog.value.open) dialog.value.showModal()
  if (!image && dialog.value.open) dialog.value.close()
})

function reset(smooth = true) {
  animate.value = smooth
  scale.value = 1
  tx.value = 0
  ty.value = 0
}

// Keep the image from being dragged out of view.
function clamp() {
  const el = img.value
  if (!el) return
  const maxX = Math.max(0, (el.offsetWidth * scale.value - window.innerWidth) / 2)
  const maxY = Math.max(0, (el.offsetHeight * scale.value - window.innerHeight) / 2)
  tx.value = Math.min(maxX, Math.max(-maxX, tx.value))
  ty.value = Math.min(maxY, Math.max(-maxY, ty.value))
}

// Zoom to `next`, keeping the screen point (x, y) fixed under the finger / cursor.
function zoomAt(next: number, x: number, y: number) {
  next = Math.min(MAX, Math.max(MIN, next))
  const px = x - window.innerWidth / 2
  const py = y - window.innerHeight / 2
  const ratio = next / scale.value
  tx.value = px - (px - tx.value) * ratio
  ty.value = py - (py - ty.value) * ratio
  scale.value = next
  if (next === MIN) {
    tx.value = 0
    ty.value = 0
  }
  clamp()
}

// --- pointer gestures ---
const pointers = new Map<number, { x: number, y: number }>()
let pinch: { dist: number, scale: number } | null = null
let pan: { x: number, y: number, tx: number, ty: number } | null = null
let moved = false
let downOnImage = false // pointer capture retargets pointerup, so remember where the gesture began
let lastTap = { time: 0, x: 0, y: 0 }

function distance() {
  const [a, b] = [...pointers.values()]
  return Math.hypot(a!.x - b!.x, a!.y - b!.y)
}

function midpoint() {
  const [a, b] = [...pointers.values()]
  return { x: (a!.x + b!.x) / 2, y: (a!.y + b!.y) / 2 }
}

function onPointerDown(e: PointerEvent) {
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  animate.value = false
  if (pointers.size === 1) {
    moved = false
    downOnImage = e.target === img.value
    pan = { x: e.clientX, y: e.clientY, tx: tx.value, ty: ty.value }
  }
  else if (pointers.size === 2) {
    pan = null
    pinch = { dist: distance(), scale: scale.value }
  }
}

function onPointerMove(e: PointerEvent) {
  if (!pointers.has(e.pointerId)) return
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (pinch && pointers.size >= 2) {
    moved = true
    const mid = midpoint()
    zoomAt(pinch.scale * (distance() / pinch.dist), mid.x, mid.y)
  }
  else if (pan) {
    const dx = e.clientX - pan.x
    const dy = e.clientY - pan.y
    if (Math.hypot(dx, dy) > 6) moved = true
    if (zoomed.value) {
      tx.value = pan.tx + dx
      ty.value = pan.ty + dy
      clamp()
    }
  }
}

function onPointerUp(e: PointerEvent) {
  if (!pointers.has(e.pointerId)) return
  pointers.delete(e.pointerId)
  if (pointers.size < 2) pinch = null
  if (pointers.size === 1) {
    // one finger left after a pinch: continue as a pan from here
    const [p] = [...pointers.values()]
    pan = { x: p!.x, y: p!.y, tx: tx.value, ty: ty.value }
    return
  }
  if (pointers.size > 0) return
  pan = null
  if (scale.value < 1.05) reset()
  if (moved || e.type === 'pointercancel') return

  // A tap: double-tap on the image toggles zoom, a tap outside it closes.
  const onImage = downOnImage
  const now = Date.now()
  const isDouble = now - lastTap.time < 300 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30
  lastTap = { time: now, x: e.clientX, y: e.clientY }
  if (onImage && isDouble) {
    lastTap.time = 0
    animate.value = true
    if (zoomed.value) reset()
    else zoomAt(DOUBLE_TAP_ZOOM, e.clientX, e.clientY)
  }
  else if (!onImage && !zoomed.value) {
    close()
  }
}

function onWheel(e: WheelEvent) {
  animate.value = false
  // ctrlKey is set for trackpad pinch; plain wheel zooms more gently.
  const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002))
  zoomAt(scale.value * factor, e.clientX, e.clientY)
}

// Safari fires its own gesture events for pinch; stop them from zooming the page.
function preventGesture(e: Event) {
  e.preventDefault()
}
onMounted(() => {
  document.addEventListener('gesturestart', preventGesture)
})
onBeforeUnmount(() => {
  document.removeEventListener('gesturestart', preventGesture)
})
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    :aria-label="$t('lightbox.label')"
    @close="close"
  >
    <div
      v-if="current"
      class="fixed inset-0 grid touch-none select-none place-items-center overflow-hidden"
      :class="zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-out'"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @wheel.prevent="onWheel"
    >
      <img
        ref="img"
        :src="current.src"
        :alt="current.alt ?? ''"
        draggable="false"
        class="max-h-[85dvh] max-w-[94vw] rounded-md object-contain will-change-transform"
        :class="[animate && 'transition-transform duration-300 ease-out', !zoomed && 'cursor-zoom-in']"
        :style="{ transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})` }"
      >
    </div>
    <p
      v-if="current?.alt"
      class="pointer-events-none fixed inset-x-0 bottom-4 px-6 text-center text-sm text-white/80 transition-opacity"
      :class="{ 'opacity-0': zoomed }"
    >
      {{ current.alt }}
    </p>
    <button
      type="button"
      class="fixed right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
      @click="close"
    >
      <span class="sr-only">{{ $t('lightbox.close') }}</span>
      <Icon name="lucide:x" class="size-5" aria-hidden="true" />
    </button>
  </dialog>
</template>

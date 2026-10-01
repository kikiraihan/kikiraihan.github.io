<script setup lang="ts">
// The old site loaded Crisp on every page. Here it is loaded only when the visitor asks for it,
// so it costs nothing for performance until then.
// Crisp's own launcher bubble is kept hidden: this button stays the only entry point,
// so after the chat window is closed the visitor sees this button again (not Crisp's default one).
const { crispWebsiteId } = useAppConfig()
const loading = ref(false)
const loaded = ref(false)
const chatOpen = ref(false)

type CrispWindow = Window & { $crisp?: unknown[][], CRISP_WEBSITE_ID?: string }

const CRISP_SCRIPT = 'https://client.crisp.chat/l.js'
let warmedUp = false
let loadingTimer: ReturnType<typeof setTimeout> | undefined

// Hover / focus / touch on the button: open the connections to Crisp and fetch l.js ahead of the click,
// so the chat opens faster. Nothing runs and no Crisp session starts until the actual click.
function warmUp() {
  if (warmedUp || loaded.value) return
  warmedUp = true
  for (const origin of ['https://client.crisp.chat', 'https://settings.crisp.chat', 'https://client.relay.crisp.chat']) {
    const l = document.createElement('link')
    l.rel = 'preconnect'
    l.href = origin
    l.crossOrigin = ''
    document.head.appendChild(l)
  }
  const p = document.createElement('link')
  p.rel = 'preload'
  p.as = 'script'
  p.href = CRISP_SCRIPT
  document.head.appendChild(p)
}

function stopLoading() {
  loading.value = false
  clearTimeout(loadingTimer)
}

function crisp(...cmd: unknown[]) {
  (window as CrispWindow).$crisp?.push(cmd)
}

function onOpened() {
  chatOpen.value = true
  // l.js only bootstraps Crisp; keep the spinner until the chat window is actually open
  stopLoading()
}
function onClosed() {
  chatOpen.value = false
  // hide the whole Crisp widget (incl. its launcher) once the window is closed
  crisp('do', 'chat:hide')
}
function onMessageReceived() {
  // an operator replied while the widget was hidden: bring the window back
  crisp('do', 'chat:show')
  crisp('do', 'chat:open')
}

function openChat() {
  const w = window as CrispWindow
  if (loaded.value) {
    crisp('do', 'chat:show')
    crisp('do', 'chat:open')
    return
  }
  loading.value = true
  // safety net: never leave the button stuck in the loading state (e.g. Crisp blocked by an ad blocker)
  loadingTimer = setTimeout(stopLoading, 15000)
  // Commands queued before l.js loads are replayed by Crisp in order.
  w.$crisp = [
    ['safe', true],
    ['on', 'chat:opened', onOpened],
    ['on', 'chat:closed', onClosed],
    ['on', 'message:received', onMessageReceived],
    ['do', 'chat:show'],
    ['do', 'chat:open'],
  ]
  w.CRISP_WEBSITE_ID = crispWebsiteId
  const s = document.createElement('script')
  s.src = CRISP_SCRIPT
  s.async = true
  s.onload = () => { loaded.value = true }
  s.onerror = stopLoading
  document.head.appendChild(s)
}
</script>

<template>
  <button
    v-if="crispWebsiteId && !chatOpen"
    type="button"
    class="ask-btn fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2.5"
    :disabled="loading"
    @pointerenter="warmUp"
    @focus="warmUp"
    @touchstart.passive="warmUp"
    @click="openChat"
  >
    <Icon :name="loading ? 'lucide:loader-circle' : 'lucide:message-circle'" class="size-4" :class="{ 'animate-spin': loading }" aria-hidden="true" />
    Ask something
  </button>
</template>

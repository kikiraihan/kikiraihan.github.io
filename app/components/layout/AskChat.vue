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

function crisp(...cmd: unknown[]) {
  (window as CrispWindow).$crisp?.push(cmd)
}

function onOpened() {
  chatOpen.value = true
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
  s.src = 'https://client.crisp.chat/l.js'
  s.async = true
  s.onload = () => { loaded.value = true; loading.value = false }
  s.onerror = () => { loading.value = false }
  document.head.appendChild(s)
}
</script>

<template>
  <button
    v-if="crispWebsiteId && !chatOpen"
    type="button"
    class="ask-btn fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2.5"
    :disabled="loading"
    @click="openChat"
  >
    <Icon :name="loading ? 'lucide:loader-circle' : 'lucide:message-circle'" class="size-4" :class="{ 'animate-spin': loading }" aria-hidden="true" />
    Ask something
  </button>
</template>

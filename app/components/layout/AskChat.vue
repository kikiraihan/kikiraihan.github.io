<script setup lang="ts">
// The old site loaded Crisp on every page. Here it is loaded only when the visitor asks for it,
// so it costs nothing for performance until then.
const { crispWebsiteId } = useAppConfig()
const loading = ref(false)
const loaded = ref(false)

type CrispWindow = Window & { $crisp?: unknown[][], CRISP_WEBSITE_ID?: string }

function openChat() {
  const w = window as CrispWindow
  if (loaded.value) {
    w.$crisp?.push(['do', 'chat:open'])
    return
  }
  loading.value = true
  w.$crisp = [['do', 'chat:open']]
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
    v-if="crispWebsiteId && !loaded"
    type="button"
    class="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-sm shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:border-ink"
    :disabled="loading"
    @click="openChat"
  >
    <Icon :name="loading ? 'lucide:loader-circle' : 'lucide:message-circle'" class="size-4" :class="{ 'animate-spin': loading }" aria-hidden="true" />
    Ask something
  </button>
</template>

<script setup lang="ts">
// Floating "Ask something" entry point. Which one is used is set by `askChat.provider` in app.config.ts:
// - 'whatsapp': our own button (styled per theme via the `.ask-btn` hook) that opens a WhatsApp chat.
// - 'crisp': Crisp's own launcher bubble. We don't render a button or restyle anything; Crisp looks
//   exactly as configured in the Crisp dashboard.
const { askChat, crispWebsiteId } = useAppConfig()
const site = useSiteConfig()

const isWhatsApp = computed(() => askChat.provider === 'whatsapp')

const whatsappUrl = computed(() => {
  const number = askChat.whatsapp.number.replace(/\D/g, '')
  if (!number) return ''
  // pre-filled message in the visitor's current language
  const message = site.value.askChat.whatsapp.message
  const text = message ? `&text=${encodeURIComponent(message)}` : ''
  // api.whatsapp.com directly instead of wa.me: wa.me redirects there cross-origin, and Firefox can
  // block that redirect in a new tab with NS_ERROR_DOM_COOP_FAILED (WhatsApp sends a COOP header).
  return `https://api.whatsapp.com/send?phone=${number}${text}`
})

type CrispWindow = Window & { $crisp?: unknown[][], CRISP_WEBSITE_ID?: string }

const CRISP_SCRIPT = 'https://client.crisp.chat/l.js'

// The old site loaded Crisp on every page right away. Here it is loaded only once the browser is idle
// after the page has loaded, so it doesn't compete with the page itself for performance.
function loadCrisp() {
  const w = window as CrispWindow
  if (w.$crisp) return
  w.$crisp = [['safe', true]]
  w.CRISP_WEBSITE_ID = crispWebsiteId
  const s = document.createElement('script')
  s.src = CRISP_SCRIPT
  s.async = true
  document.head.appendChild(s)
}

onMounted(() => {
  if (askChat.provider !== 'crisp' || !crispWebsiteId) return
  if ('requestIdleCallback' in window) requestIdleCallback(loadCrisp, { timeout: 4000 })
  else setTimeout(loadCrisp, 2000)
})
</script>

<template>
  <a
    v-if="isWhatsApp && whatsappUrl"
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="ask-btn fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2.5"
    :aria-label="$t('askChat.aria')"
  >
    <Icon name="simple-icons:whatsapp" class="size-4" aria-hidden="true" />
    {{ $t('askChat.label') }}
  </a>
</template>

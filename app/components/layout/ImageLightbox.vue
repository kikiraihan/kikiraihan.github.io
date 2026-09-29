<script setup lang="ts">
// Native <dialog>: Esc to close, focus is trapped and restored by the browser.
const { current, close } = useLightbox()
const dialog = ref<HTMLDialogElement>()

watch(current, (image) => {
  if (!dialog.value) return
  if (image && !dialog.value.open) dialog.value.showModal()
  if (!image && dialog.value.open) dialog.value.close()
})

function onBackdrop(e: MouseEvent) {
  if (e.target === dialog.value) close()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    aria-label="Image preview"
    @close="close"
    @click="onBackdrop"
  >
    <figure v-if="current" class="flex max-h-[92dvh] max-w-[94vw] flex-col items-center gap-3">
      <img :src="current.src" :alt="current.alt ?? ''" class="max-h-[85dvh] w-auto rounded-md object-contain">
      <figcaption v-if="current.alt" class="text-sm text-white/80">
        {{ current.alt }}
      </figcaption>
    </figure>
    <button
      type="button"
      class="fixed right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
      @click="close"
    >
      <span class="sr-only">Close preview</span>
      <Icon name="lucide:x" class="size-5" aria-hidden="true" />
    </button>
  </dialog>
</template>

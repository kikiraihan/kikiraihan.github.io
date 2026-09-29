// Click-to-preview images (replaces the old #previewContainer script).
interface LightboxImage {
  src: string
  alt?: string
}

export function useLightbox() {
  const current = useState<LightboxImage | null>('lightbox', () => null)
  return {
    current,
    open: (image: LightboxImage) => { current.value = image },
    close: () => { current.value = null },
  }
}

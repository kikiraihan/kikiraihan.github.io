// Small typewriter loop (replaces Typed.js, no extra dependency).
export function useTypewriter(words: string[], { typeSpeed = 55, backSpeed = 30, hold = 1600 } = {}) {
  const text = ref(words[0] ?? '')
  let timer: ReturnType<typeof setTimeout> | undefined

  onMounted(() => {
    if (!motionAllowed() || words.length < 2) return
    let index = 0
    let char = text.value.length
    let deleting = true

    const tick = () => {
      const word = words[index]!
      if (deleting) {
        char--
        text.value = word.slice(0, char)
        if (char === 0) {
          deleting = false
          index = (index + 1) % words.length
        }
        timer = setTimeout(tick, backSpeed)
      }
      else {
        const next = words[index]!
        char++
        text.value = next.slice(0, char)
        if (char === next.length) {
          deleting = true
          timer = setTimeout(tick, hold)
        }
        else {
          timer = setTimeout(tick, typeSpeed)
        }
      }
    }
    timer = setTimeout(tick, hold)
  })

  onBeforeUnmount(() => clearTimeout(timer))
  return text
}

// Same behaviour as the old darkmode.js: follow the OS, but remember an explicit choice
// in localStorage("color-scheme") only when it differs from the OS preference.
const STORAGE_KEY = 'color-scheme'

export function useColorScheme() {
  const isDark = useState('color-scheme-dark', () => false)

  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })

  function apply(dark: boolean) {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
    try {
      const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (dark === osDark) localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    }
    catch {
      // storage unavailable (private mode) — the class toggle still works
    }
  }

  return { isDark, toggle: () => apply(!isDark.value) }
}

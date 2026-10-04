// app.config.ts in the current language: every `{ en: …, id: … }` value is replaced by the one for the
// active locale (English when a language is missing). Plain values are passed through unchanged.

type LocaleCode = 'en' | 'id'

/** `{ en: X, id: X }` → X, recursively through arrays and objects. */
export type Localized<T>
  = T extends { en: infer U, id: unknown } ? Localized<U>
    : T extends readonly (infer E)[] ? Localized<E>[]
      : T extends object ? { [K in keyof T]: Localized<T[K]> }
        : T

function isLocaleMap(value: unknown): value is Record<LocaleCode, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value) && 'en' in value && 'id' in value
}

export function localize<T>(value: T, locale: string): Localized<T> {
  if (isLocaleMap(value)) return localize((value as Record<string, unknown>)[locale] ?? value.en, locale) as Localized<T>
  if (Array.isArray(value)) return value.map(v => localize(v, locale)) as Localized<T>
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v, locale)])) as Localized<T>
  }
  return value as Localized<T>
}

/** Reactive, localized app config — use instead of useAppConfig() for anything shown to visitors. */
export function useSiteConfig() {
  const appConfig = useAppConfig()
  const { locale } = useI18n()
  return computed(() => localize(appConfig, locale.value))
}

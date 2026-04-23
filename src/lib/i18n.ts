// i18n configuration — extend with next-intl or similar for production
export const defaultLocale = 'en'
export const supportedLocales = ['en'] as const
export type Locale = (typeof supportedLocales)[number]

// Simple key-value translation loader
const translations: Record<Locale, Record<string, string>> = {
  en: {},
}

let _loaded: Record<string, string> = {}

export async function loadLocale(locale: Locale = defaultLocale): Promise<void> {
  try {
    const mod = await import(`../locales/${locale}.json`)
    _loaded = mod.default ?? mod
    translations[locale] = _loaded
  } catch {
    _loaded = translations[locale] ?? {}
  }
}

export function t(key: string, fallback?: string): string {
  return _loaded[key] ?? fallback ?? key
}

export const SUPPORTED_LOCALES = [
  'en',
  'es',
  'ca',
  'fr',
  'pt',
  'de',
  'ja',
  'it',
  'ko',
  'zh-CN',
  'zh-TW',
] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_INFO: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  ca: { name: 'Català', flag: '🏳️' },
  fr: { name: 'Français', flag: '🇫🇷' },
  pt: { name: 'Português', flag: '🇧🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ja: { name: '日本語', flag: '🇯🇵' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  ko: { name: '한국어', flag: '🇰🇷' },
  'zh-CN': { name: '中文 (简体)', flag: '🇨🇳' },
  'zh-TW': { name: '中文 (繁體)', flag: '🇹🇼' },
}

export function getDefaultLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'

  try {
    const lang = navigator.language

    if (SUPPORTED_LOCALES.includes(lang as Locale)) {
      return lang as Locale
    }

    const primary = lang.split('-')[0] ?? 'en'
    const match = SUPPORTED_LOCALES.find((l) => l.startsWith(primary))
    if (match) return match
  } catch {
    /* ignore */
  }

  return 'en'
}

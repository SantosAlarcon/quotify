'use client'

import type { Locale } from '../i18n/types'
import { SUPPORTED_LOCALES, LOCALE_INFO } from '../i18n/types'
import { useI18nStore } from '../store/i18n-store'

export function LocaleSelector() {
  const locale = useI18nStore((s) => s.locale)
  const setLocale = useI18nStore((s) => s.setLocale)

  return (
    <select
      className="locale-selector"
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Select language"
    >
      {SUPPORTED_LOCALES.map((code) => (
        <option key={code} value={code}>
          {LOCALE_INFO[code].flag} {LOCALE_INFO[code].name}
        </option>
      ))}
    </select>
  )
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '../i18n/types'
import { getDefaultLocale } from '../i18n/types'

type I18nState = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: getDefaultLocale(),
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: 'quotify-locale',
      partialize: (state) => ({ locale: state.locale }),
    },
  ),
)

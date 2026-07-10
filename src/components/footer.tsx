'use client'

import { useTranslations } from '../i18n/use-translations'

export const Footer = () => {
  const { t } = useTranslations()

  return (
    <footer className="app__footer">
      <span>{t('footer.tagline')}</span>
    </footer>
  )
}

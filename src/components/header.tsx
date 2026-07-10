'use client'

import { useTranslations } from '../i18n/use-translations'
import { LocaleSelector } from './locale-selector'

export const Header = () => {
  const { t } = useTranslations()

  return (
    <header className="app__header">
      <svg aria-label={t('header.logoAriaLabel')}>
        <use href="images/logo2.svg#logo" />
      </svg>
      <LocaleSelector />
    </header>
  )
}

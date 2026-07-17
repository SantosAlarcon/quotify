'use client'

import { useQuoteStore } from '../store/quote-store'
import { QuoteCardContent } from './quote-card'
import { useFontLoader } from '../lib/use-font-loader'
import { useTranslations } from '../i18n/use-translations'

type Props = {
  id?: string
}

export function QuotePreview({ id }: Props) {
  const isFontReady = useQuoteStore((s) => s.isFontReady)
  const text = useQuoteStore((s) => s.text)
  const name = useQuoteStore((s) => s.name)
  const headline = useQuoteStore((s) => s.headline)
  const photo = useQuoteStore((s) => s.photo)
  const logo = useQuoteStore((s) => s.logo)
  const logoOpacity = useQuoteStore((s) => s.logoOpacity)
  const logoPosition = useQuoteStore((s) => s.logoPosition)
  const cardBgColor = useQuoteStore((s) => s.cardBgColor)
  const cardTextColor = useQuoteStore((s) => s.cardTextColor)
  const accentColor = useQuoteStore((s) => s.accentColor)
  const fontFamily = useQuoteStore((s) => s.fontFamily)
  const fontSize = useQuoteStore((s) => s.fontSize)
  const textAlign = useQuoteStore((s) => s.textAlign)
  const layoutPreset = useQuoteStore((s) => s.layoutPreset)
  const aspectRatio = useQuoteStore((s) => s.aspectRatio)
  const bgType = useQuoteStore((s) => s.bgType)
  const bgGradient = useQuoteStore((s) => s.bgGradient)
  const { t } = useTranslations()

  useFontLoader()

  return (
    <div className={`preview-frame${!isFontReady ? ' preview-frame--loading-font' : ''}`} id={id}>
      <div className="preview-frame__card">
        <QuoteCardContent
          text={text}
          name={name}
          headline={headline}
          photo={photo}
          logo={logo}
          logoOpacity={logoOpacity}
          logoPosition={logoPosition}
          cardBgColor={cardBgColor}
          cardTextColor={cardTextColor}
          accentColor={accentColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          textAlign={textAlign}
          layoutPreset={layoutPreset}
          aspectRatio={aspectRatio}
          bgType={bgType}
          bgGradient={bgGradient}
        />
      </div>
      {!isFontReady && (
        <p className="preview-frame__font-loading" role="status" aria-live="polite">
          {t('quotePreview.loadingFont')}
        </p>
      )}
    </div>
  )
}

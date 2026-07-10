'use client'

import { forwardRef, type Ref } from 'react'
import { useQuoteStore } from '../store/quote-store'
import { QuoteCardContent } from './quote-card'
import { useFontLoader } from '../lib/use-font-loader'
import { useTranslations } from '../i18n/use-translations'

type Props = {
  id?: string
}

export const QuotePreview = forwardRef(function QuotePreview(
  { id }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const state = useQuoteStore()
  const { t } = useTranslations()

  useFontLoader()

  return (
    <div className={`preview-frame${!state.isFontReady ? ' preview-frame--loading-font' : ''}`} ref={ref} id={id}>
      <div className="preview-frame__card">
        <QuoteCardContent
          text={state.text}
          name={state.name}
          headline={state.headline}
          photo={state.photo}
          logo={state.logo}
          cardBgColor={state.cardBgColor}
          cardTextColor={state.cardTextColor}
          accentColor={state.accentColor}
          fontFamily={state.fontFamily}
          fontSize={state.fontSize}
          textAlign={state.textAlign}
          layoutPreset={state.layoutPreset}
          aspectRatio={state.aspectRatio}
          bgType={state.bgType}
          bgGradient={state.bgGradient} logoOpacity={state.logoOpacity} logoPosition={state.logoPosition} />
      </div>
      {!state.isFontReady && (
        <p className="preview-frame__font-loading" role="status" aria-live="polite">
          {t('quotePreview.loadingFont')}
        </p>
      )}
    </div>
  )
})

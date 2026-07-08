'use client'

import { forwardRef, type Ref } from 'react'
import { useQuoteStore } from '../store/quote-store'
import { QuoteCardContent } from './quote-card'

type Props = {
  id?: string
}

export const QuotePreview = forwardRef(function QuotePreview(
  { id }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const state = useQuoteStore()

  return (
    <div className="preview-frame" ref={ref} id={id}>
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
          layoutPreset={state.layoutPreset}
          aspectRatio={state.aspectRatio}
        />
      </div>
    </div>
  )
})

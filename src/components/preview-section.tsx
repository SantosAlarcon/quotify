'use client'

import { useRef } from 'react'
import { useQuoteStore } from '../store/quote-store'
import { ExportButton } from './export-button'
import { QuotePreview } from './quote-preview'

export function PreviewSection() {
  const cardRef = useRef<HTMLDivElement>(null)
  const text = useQuoteStore((s) => s.text)

  return (
    <>
      <QuotePreview ref={cardRef} />
      <ExportButton cardRef={cardRef} disabled={!text} />
    </>
  )
}

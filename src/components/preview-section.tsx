'use client'

import { useQuoteStore } from '../store/quote-store'
import { ExportButton } from './export-button'
import { QuotePreview } from './quote-preview'

export function PreviewSection() {
  const text = useQuoteStore((s) => s.text)

  return (
    <>
      <QuotePreview />
      <ExportButton disabled={!text} />
    </>
  )
}

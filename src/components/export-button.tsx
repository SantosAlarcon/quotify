'use client'

import { useState, useRef, type RefObject } from 'react'
import { toPng } from 'html-to-image'

type Props = {
  cardRef: RefObject<HTMLElement | null>
  disabled?: boolean
}

export function ExportButton({ cardRef, disabled }: Props) {
  const [exporting, setExporting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const liveRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    const el = cardRef.current
    if (!el) return

    setExporting(true)
    setStatus('idle')
    try {
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      })

      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'quote.png'
      a.click()
      setStatus('success')
    } catch (err) {
      console.error('Export failed:', err)
      setStatus('error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="export-wrapper">
      <button
        className="export-btn"
        onClick={handleExport}
        disabled={exporting || disabled}
        aria-busy={exporting}
		aria-label='Export as PNG'
      >
        {exporting ? 'Generating...' : 'Export as PNG'}
      </button>
      <div
        ref={liveRef}
        className="export-live"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status === 'success' && 'Image downloaded'}
        {status === 'error' && 'Export failed. Try again.'}
      </div>
    </div>
  )
}

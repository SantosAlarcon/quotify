'use client'

import { useState, useRef, useEffect, type RefObject } from 'react'
import { toPng } from 'html-to-image'
import { useQuoteStore } from '../store/quote-store'
import { useTranslations } from '../i18n/use-translations'

type Props = {
  cardRef: RefObject<HTMLElement | null>
  disabled?: boolean
}

export function ExportButton({ cardRef, disabled }: Props) {
  const [exporting, setExporting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const liveRef = useRef<HTMLDivElement>(null)
  const isFontReady = useQuoteStore(s => s.isFontReady)
  const { t } = useTranslations()

  useEffect(() => {
    if (status === 'success') {
      const id = setTimeout(() => setStatus('idle'), 3000)
      return () => clearTimeout(id)
    }
  }, [status])

  const handleExport = async () => {
    const el = cardRef.current
    if (!el) return

    if (!isFontReady) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

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
      a.download = t('export.fileName')
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
        aria-label={t('export.button')}
      >
        {exporting ? t('export.generating') : t('export.button')}
      </button>
      <div
        ref={liveRef}
        className="export-live"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status === 'success' && t('export.downloaded')}
        {status === 'error' && !isFontReady && t('export.fontNotReady')}
        {status === 'error' && isFontReady && t('export.failed')}
      </div>
    </div>
  )
}

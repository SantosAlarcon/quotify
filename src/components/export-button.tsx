'use client'

import { toPng } from 'html-to-image'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { useTranslations } from '../i18n/use-translations'
import { exportToSvg } from '../lib/svg-export'
import { useQuoteStore } from '../store/quote-store'

type Props = {
	cardRef: RefObject<HTMLElement | null>
	disabled?: boolean
}

type Format = 'png'

export function ExportButton({ cardRef, disabled }: Props) {
	const [exporting, setExporting] = useState<Format | null>(null)
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

	const handleExport = async (format: Format) => {
		const el = cardRef.current
		if (!el) return

		if (!isFontReady) {
			setStatus('error')
			setTimeout(() => setStatus('idle'), 2000)
			return
		}

		setExporting(format)
		setStatus('idle')
		try {
			const dataUrl =
				format === 'png'
					? await toPng(el, { quality: 1, pixelRatio: 2, cacheBust: true })
					: await exportToSvg(el)

			const a = document.createElement('a')
			a.href = dataUrl
			a.download = format === 'png' ? t('export.fileName') : t('export.fileNameSvg')
			a.click()
			setStatus('success')
		} catch (err) {
			console.error('Export failed:', err)
			setStatus('error')
		} finally {
			setExporting(null)
		}
	}

	return (
		<div className="export-wrapper">
			<div className="export-buttons">
				<button
					type='button'
					className="export-btn"
					onClick={() => handleExport('png')}
					disabled={exporting !== null || disabled}
					aria-busy={exporting === 'png'}
					aria-label={t('export.button')}
				>
					{exporting === 'png' ? t('export.generating') : t('export.button')}
				</button>
				{/* <button */}
				{/*   className="export-btn" */}
				{/*   onClick={() => handleExport('svg')} */}
				{/*   disabled={exporting !== null || disabled} */}
				{/*   aria-busy={exporting === 'svg'} */}
				{/*   aria-label={t('export.buttonSvg')} */}
				{/* > */}
				{/*   {exporting === 'svg' ? t('export.generating') : t('export.buttonSvg')} */}
				{/* </button> */}
			</div>
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

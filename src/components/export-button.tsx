'use client'

import { type RefObject, useEffect, useRef, useState } from 'react'
import { useTranslations } from '../i18n/use-translations'
import { useQuoteStore } from '../store/quote-store'

type Props = {
	disabled?: boolean
}

export function ExportButton({ disabled }: Props) {
	const [exporting, setExporting] = useState<boolean>(false)
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
		if (!isFontReady) {
			setStatus('error')
			setTimeout(() => setStatus('idle'), 2000)
			return
		}

		setExporting(true)
		setStatus('idle')
		try {
			const state = useQuoteStore.getState()

			const res = await fetch('/export', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					text: state.text,
					name: state.name,
					headline: state.headline,
					photo: state.photo,
					logo: state.logo,
					logoOpacity: state.logoOpacity,
					logoPosition: state.logoPosition,
					cardBgColor: state.cardBgColor,
					cardTextColor: state.cardTextColor,
					fontFamily: state.fontFamily,
					fontSize: state.fontSize,
					textAlign: state.textAlign,
					layoutPreset: state.layoutPreset,
					aspectRatio: state.aspectRatio,
					accentColor: state.accentColor,
					bgType: state.bgType,
					bgGradient: state.bgGradient,
					customFont: state.customFont,
					emptyText: t('quoteCard.empty'),
				}),
			})

			if (!res.ok) {
				throw new Error(`Export failed: ${res.status}`)
			}

			const blob = await res.blob()
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = t('export.fileName')
			a.click()
			setTimeout(() => URL.revokeObjectURL(url), 100)
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
			<div className="export-buttons">
				<button
					type='button'
					className="export-btn"
					onClick={handleExport}
					disabled={exporting || disabled}
					aria-busy={exporting}
					aria-label={t('export.button')}
				>
					{exporting ? t('export.generating') : t('export.button')}
				</button>
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

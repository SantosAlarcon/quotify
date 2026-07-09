'use client'

import { useEffect, useRef } from 'react'
import { useQuoteStore } from '../store/quote-store'
import { getFontByFamily, getPrimaryFontName } from './fonts'

function getFormatFromDataUrl(dataUrl: string): string {
	const match = dataUrl.match(/^data:([^;]+);/)
	const mime = match?.[1] ?? ''
	switch (mime) {
		case 'font/woff2': return 'woff2'
		case 'font/woff': return 'woff'
		case 'font/ttf':
		case 'application/x-font-ttf': return 'truetype'
		case 'font/otf':
		case 'application/x-font-opentype': return 'opentype'
		default: return 'woff2'
	}
}

export function useFontLoader() {
	const fontFamily = useQuoteStore(s => s.fontFamily)
	const customFont = useQuoteStore(s => s.customFont)
	const setFontReady = useQuoteStore(s => s.setFontReady)

	const prevLinkRef = useRef<HTMLLinkElement | null>(null)
	const prevStyleRef = useRef<HTMLStyleElement | null>(null)

	useEffect(() => {
		const font = getFontByFamily(fontFamily)

		if (prevLinkRef.current) {
			document.head.removeChild(prevLinkRef.current)
			prevLinkRef.current = null
		}
		if (prevStyleRef.current) {
			document.head.removeChild(prevStyleRef.current)
			prevStyleRef.current = null
		}

		setFontReady(false)

		if (customFont && fontFamily === customFont.name) {
			const format = getFormatFromDataUrl(customFont.dataUrl)
			const style = document.createElement('style')
			style.textContent = `
@font-face {
	font-family: '${customFont.name}';
	src: url(${customFont.dataUrl}) format('${format}');
	font-weight: 400 700;
	font-style: normal;
}
			`
			document.head.appendChild(style)
			prevStyleRef.current = style

			document.fonts
				.load(`1em '${customFont.name}'`)
				.then(() => setFontReady(true))
				.catch(() => setFontReady(true))
		} else if (font?.source === 'google' && font.googleUrl) {
			const link = document.createElement('link')
			link.rel = 'stylesheet'
			link.href = font.googleUrl
			link.onload = async () => {
				if (prevLinkRef.current !== link) return
				await document.fonts.ready
				await document.fonts.load(`1em '${getPrimaryFontName(fontFamily)}'`)
				if (prevLinkRef.current === link) setFontReady(true)
			}
			link.onerror = () => {
				if (prevLinkRef.current === link) setFontReady(true)
			}
			document.head.appendChild(link)
			prevLinkRef.current = link
		} else {
			setFontReady(true)
		}

		return () => {
			if (prevLinkRef.current) {
				document.head.removeChild(prevLinkRef.current)
			}
			if (prevStyleRef.current) {
				document.head.removeChild(prevStyleRef.current)
			}
		}
	}, [fontFamily, customFont, setFontReady])
}

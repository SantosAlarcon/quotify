const RELEVANT_STYLE_PROPS = [
	'display', 'position', 'top', 'right', 'bottom', 'left',
	'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
	'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
	'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
	'border', 'border-radius', 'border-color', 'border-width', 'border-style',
	'background-color', 'background-image', 'background-size', 'background-position',
	'background-repeat', 'background', 'color', 'opacity',
	'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
	'text-align', 'text-decoration', 'text-transform', 'letter-spacing',
	'white-space', 'word-wrap', 'overflow-wrap', 'text-overflow',
	'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items',
	'align-self', 'gap',
	'overflow', 'z-index', 'filter', 'backdrop-filter',
	'box-shadow', 'transform',
	'object-fit',
]

function inlineComputedStyles(source: Element, clone: HTMLElement) {
	const computed = window.getComputedStyle(source)
	const style = clone.style
	for (const prop of RELEVANT_STYLE_PROPS) {
		style.setProperty(prop, computed.getPropertyValue(prop))
	}
}

async function embedImageAsDataUrl(img: HTMLImageElement): Promise<void> {
	if (img.src.startsWith('data:')) return
	try {
		const res = await fetch(img.src, { cache: 'no-store' })
		const blob = await res.blob()
		const dataUrl = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result as string)
			reader.onerror = reject
			reader.readAsDataURL(blob)
		})
		img.src = dataUrl
		img.removeAttribute('srcset')
	} catch {
		/* keep original src */
	}
}

function walkAndStyle(source: Node, target: Node, imagePromises: Promise<void>[]) {
	if (!(source instanceof Element) || !(target instanceof HTMLElement)) return

	inlineComputedStyles(source, target)

	const srcKids = source.childNodes
	const tgtKids = target.childNodes

	for (let i = 0; i < srcKids.length; i++) {
		const src = srcKids[i]
		const tgt = tgtKids[i]
		if (!src || !tgt) continue

		if (src instanceof HTMLImageElement && tgt instanceof HTMLImageElement) {
			imagePromises.push(embedImageAsDataUrl(tgt))
		} else {
			walkAndStyle(src, tgt, imagePromises)
		}
	}
}

function collectFontFaceCSS(): string {
	const rules: string[] = []
	for (const sheet of Array.from(document.styleSheets)) {
		try {
			for (const rule of Array.from(sheet.cssRules ?? [])) {
				if (rule instanceof CSSFontFaceRule) {
					rules.push(rule.cssText)
				}
			}
		} catch { /* cross-origin */ }
	}
	return rules.join('\n')
}

function svgToDataUrl(svg: SVGElement): string {
	const serializer = new XMLSerializer()
	const svgString = serializer.serializeToString(svg)
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
}

export async function exportToSvg(node: HTMLElement): Promise<string> {
	const rect = node.getBoundingClientRect()
	const width = Math.round(rect.width)
	const height = Math.round(rect.height)

	const cloned = node.cloneNode(true) as HTMLElement

	const imagePromises: Promise<void>[] = []
	walkAndStyle(node, cloned, imagePromises)
	await Promise.all(imagePromises)

	const fontFaceCSS = collectFontFaceCSS()

	const SVG_NS = 'http://www.w3.org/2000/svg'
	const XHTML_NS = 'http://www.w3.org/1999/xhtml'

	const svg = document.createElementNS(SVG_NS, 'svg')
	svg.setAttribute('width', String(width))
	svg.setAttribute('height', String(height))
	svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
	svg.setAttribute('xmlns', SVG_NS)

	const fo = document.createElementNS(SVG_NS, 'foreignObject')
	fo.setAttribute('width', '100%')
	fo.setAttribute('height', '100%')
	fo.setAttribute('x', '0')
	fo.setAttribute('y', '0')

	if (fontFaceCSS) {
		const style = document.createElementNS(XHTML_NS, 'style')
		style.textContent = fontFaceCSS
		fo.appendChild(style)
	}

	fo.appendChild(cloned)
	svg.appendChild(fo)

	return svgToDataUrl(svg)
}

import { marked } from "marked";
import { googleFonts } from "takumi-js/helpers";
import type { LogoPosition, QuoteState } from "../store/quote-store";
import { FONT_OPTIONS, getPrimaryFontName } from "./fonts";

export type CardExportState = Pick<
	QuoteState,
	| "text"
	| "name"
	| "headline"
	| "photo"
	| "logo"
	| "logoOpacity"
	| "logoPosition"
	| "cardBgColor"
	| "cardTextColor"
	| "fontFamily"
	| "fontSize"
	| "textAlign"
	| "layoutPreset"
	| "aspectRatio"
	| "accentColor"
	| "bgType"
	| "bgGradient"
> & {
	customFont?: QuoteState["customFont"];
	emptyText?: string;
};

const ASPECT_DIMENSIONS: Record<string, { width: number; height: number }> = {
	"1:1": { width: 1080, height: 1080 },
	"4:5": { width: 1080, height: 1350 },
	"1.91:1": { width: 1200, height: 630 },
	"9:16": { width: 1080, height: 1920 },
};

const SYSTEM_FONT_MAP: Record<string, string> = {
	Georgia: "Noto Serif",
	"Times New Roman": "Noto Serif",
	"Courier New": "Source Code Pro",
	Arial: "Inter",
};

const REFERENCE_WIDTH = 644;

const LOGO_POS_CLASS: Record<LogoPosition, string> = {
	left: "card-logo--left",
	center: "card-logo--center",
	right: "card-logo--right",
};

function scalePx(css: string, factor: number): string {
	return css.replace(
		/(\d+(?:\.\d+)?)px/g,
		(_, n) => `${(parseFloat(n) * factor).toFixed(1).replace(/\.0$/, "")}px`,
	);
}

function getCardStylesheet(exportWidth: number): string {
	const factor = exportWidth / REFERENCE_WIDTH;
	return scalePx(CARD_STYLESHEET_RAW, factor);
}

const CARD_STYLESHEET_RAW = `
.card-content {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.08);
}

.layout-classic {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px;
	gap: 24px;
}
.layout-classic .card-header {
	position: absolute;
	top: 40px;
	left: 40px;
	display: flex;
	align-items: center;
	gap: 16px;
	width: calc(100% - 80px);
}
.layout-classic .card-logo {
	position: absolute;
	bottom: 38px;
	max-height: 72px;
	object-fit: contain;
}

.layout-modern {
	display: flex;
	flex-direction: column;
	padding: 40px;
	gap: 24px;
}
.layout-modern .card-accent-bar {
	position: absolute;
	left: 24px;
	top: 40px;
	bottom: 40px;
	width: 4px;
	border-radius: 2px;
	flex-shrink: 0;
}
.layout-modern .card-text-wrap {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 24px;
}
.layout-modern .card-footer {
	display: flex;
	align-items: center;
	gap: 12px;
	flex-shrink: 0;
}
.layout-modern .card-logo {
	position: absolute;
	bottom: 38px;
	max-height: 48px;
	object-fit: contain;
}
.layout-modern .card-photo--sm {
	width: 40px;
	height: 40px;
}

.layout-bold-quote {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px;
	gap: 24px;
}
.layout-bold-quote .card-dq {
	position: absolute;
	font-size: 400px;
	line-height: 1;
	opacity: 0.15;
	top: -32px;
	left: -8px;
	pointer-events: none;
	user-select: none;
	font-family: Georgia, 'Times New Roman', serif;
	transform: translate(0.12em, 0.18em) scale(1);
}

.layout-bold-quote .card-header {
	position: absolute;
	top: 55px;
	left: 40px;
	display: flex;
	align-items: center;
	gap: 16px;
	width: calc(100% - 80px);
}
.layout-bold-quote .card-text {
	position: relative;
	z-index: 1;
}
.layout-bold-quote .card-logo {
	position: absolute;
	bottom: 38px;
	max-height: 72px;
	object-fit: contain;
}

.layout-minimal {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48px;
	gap: 24px;
}
.layout-minimal .card-minimal-att {
	font-size: 16px;
	opacity: 0.8;
	letter-spacing: 0.02em;
}

.layout-centered {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px;
	gap: 12px;
}
.layout-centered .card-centered-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
}
.layout-centered .card-photo--xl {
	width: 80px;
	height: 80px;
}
.layout-centered .card-name {
	font-size: 21.6px;
	text-align: center;
}
.layout-centered .card-headline {
	font-size: 14.4px;
	text-align: center;
	opacity: 0.7;
}
.layout-centered .card-logo {
	position: absolute;
	bottom: 38px;
	max-height: 64px;
	object-fit: contain;
}

.layout-split {
	display: flex;
	padding: 0;
	overflow: hidden;
}
.layout-split .card-split-inner {
	display: flex;
	width: 100%;
	min-height: 100%;
}
.layout-split .card-split-left {
	width: 38%;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding: 32px;
	color: #fff;
}
.layout-split .card-split-right {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 32px;
	position: relative;
	background: inherit;
}
.layout-split .card-photo--xl {
	width: 88px;
	height: 88px;
}
.layout-split .card-split-name {
	text-align: center;
	font-weight: 600;
}
.layout-split .card-split-headline {
	text-align: center;
	opacity: 0.85;
}
.layout-split .card-logo--split {
	position: absolute;
	bottom: 38px;
	right: 20px;
	max-height: 48px;
	object-fit: contain;
}
.layout-split .card-text {
	font-size: 25.6px;
}

.layout-gradient {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px;
	gap: 16px;
	position: relative;
}
.layout-gradient .card-dq--gradient {
	position: absolute;
	font-size: 320px;
	line-height: 1;
	opacity: 0.08;
	bottom: -16px;
	right: -8px;
	pointer-events: none;
	user-select: none;
	font-family: Georgia, 'Times New Roman', serif;
}

.layout-gradient .card-dq--gradient > svg {
	transform: translate(1.95em, 1.025em) scale(6);
}

.layout-gradient .card-text {
	position: relative;
	z-index: 1;
}
.layout-gradient .card-gradient-bar {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px 24px;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(4px);
	color: #fff;
	font-size: 14px;
}
.layout-gradient .card-gradient-name {
	font-weight: 700;
}
.layout-gradient .card-gradient-headline {
	opacity: 0.75;
}

.card-logo--left {
	left: 4.5em;
}
.card-logo--center {
	left: 50%;
	right: auto;
	transform: translateX(-50%);
}
.card-logo--right {
	right: 6em;
}

.card-header {
	display: flex;
	align-items: center;
	gap: 16px;
	width: calc(100% - 80px);
}
.card-photo {
	width: 64px;
	height: 64px;
	border-radius: 50%;
	object-fit: cover;
	flex-shrink: 0;
}
.card-name {
	font-size: 20px;
	font-weight: 700;
	line-height: 1.3;
	margin: 0;
}
.card-headline {
	font-size: 16px;
	margin: 0;
	font-weight: 400;
}
.card-identity {
	text-align: left;
}
.card-text {
	line-height: 1.2;
	width: 100%;
}
.card-text--center {
	font-size: 32px;
	text-align: center;
	z-index: 1;
}
.card-text--left {
	font-size: 36px;
	text-align: left;
}
.card-text--right {
	font-size: 36px;
	text-align: right;
}
.card-text--empty {
	opacity: 0.35;
	font-style: italic;
	font-size: 20px;
}

.card-text > *:first-child {
	margin-top: 0;
}
.card-text > *:last-child {
	margin-bottom: 0;
}
.card-text a {
	color: inherit;
	text-decoration: underline;
	text-underline-offset: 2px;
	opacity: 0.85;
}
.card-text strong {
	font-weight: 700;
}
.card-text em {
	font-style: italic;
}
.card-text code {
	font-size: 0.85em;
	padding: 0.15em 0.4em;
	border-radius: 4px;
	background-color: rgba(128, 128, 128, 0.1);
}
.card-text p {
	margin: 0.5em 0;
}
.card-text ul,
.card-text ol {
	margin: 0.5em 0;
	padding-left: 1.5em;
}
.card-text li {
	margin: 0.25em 0;
}
.card-text blockquote {
	margin: 0.5em 0;
	padding-left: 1em;
	border-left: 3px solid currentColor;
	opacity: 0.85;
}
.card-text h1,
.card-text h2,
.card-text h3,
.card-text h4 {
	margin: 0.5em 0;
	line-height: 1.3;
}
`;

function resolveFontFamily(fontFamily: string): string {
	const primary = getPrimaryFontName(fontFamily);
	const id = primary.toLowerCase().replace(/\s+/g, "-");
	const fontOption = FONT_OPTIONS.find((f) => f.id === id);

	if (fontOption?.source === "google") {
		return primary;
	}

	if (fontOption?.source === "system") {
		return SYSTEM_FONT_MAP[primary] || primary;
	}

	return primary;
}

function buildFontFamilies(fontFamily: string) {
	const primary = getPrimaryFontName(fontFamily);
	const id = primary.toLowerCase().replace(/\s+/g, "-");
	const fontOption = FONT_OPTIONS.find((f) => f.id === id);

	if (fontOption?.source === "google") {
		return [{ name: primary, weight: [400, 700] }];
	}

	if (fontOption?.source === "system") {
		const alternative = SYSTEM_FONT_MAP[primary];
		if (alternative) return [{ name: alternative, weight: [400, 700] }];
	}

	return [];
}

function decodeEntities(text: string): string {
	return text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&#x201C;/g, "\u201C")
		.replace(/&#x201D;/g, "\u201D")
		.replace(/&#x2014;/g, "\u2014")
		.replace(/&#x2013;/g, "\u2013");
}

const SELF_CLOSING_TAGS = new Set([
	"br",
	"hr",
	"img",
	"input",
	"col",
	"area",
	"base",
	"link",
	"meta",
	"source",
	"svg",
	"use",
]);

function parseAttributes(raw: string): Record<string, string> {
	const props: Record<string, string> = {};
	const re = /([\w][\w-]*)=(?:"([^"]*)"|'([^']*)')/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(raw)) !== null) {
		const name = m[1];
		const value = m[2] ?? m[3] ?? "";
		if (!name) continue;
		if (name === "class") {
			props.className = value;
		} else {
			props[name] = value;
		}
	}
	return props;
}

let _key = 0;

function findMatchingClose(
	html: string,
	startAfterOpen: number,
	tagName: string,
): number {
	let depth = 1;
	let pos = startAfterOpen;
	const openRe = new RegExp(`<${tagName}[\\s>/]`);
	const closeRe = new RegExp(`</${tagName}>`);

	while (depth > 0 && pos < html.length) {
		const nextOpen = html.slice(pos).match(openRe);
		const nextClose = html.slice(pos).match(closeRe);
		const openIdx = nextOpen?.index ?? Infinity;
		const closeIdx = nextClose?.index ?? Infinity;

		if (!nextClose) return -1;

		if (closeIdx <= openIdx) {
			depth--;
			if (depth === 0) return pos + closeIdx;
			pos += closeIdx + nextClose[0].length;
		} else if (nextOpen) {
			const openTag = html.charAt(pos + openIdx + tagName.length + 1);
			if (openTag === "/" || openTag === " ") {
				const tagText = html.slice(
					pos + openIdx,
					pos + openIdx + nextOpen[0].length,
				);
				if (tagText.trimEnd().endsWith("/")) {
					pos += openIdx + nextOpen[0].length;
				} else {
					depth++;
					pos += openIdx + nextOpen[0].length;
				}
			} else {
				pos += openIdx + nextOpen[0].length;
			}
		} else {
			break;
		}
	}
	return -1;
}

function parseChildren(html: string): React.ReactNode[] {
	const nodes: React.ReactNode[] = [];
	let pos = 0;

	while (pos < html.length) {
		const ch = html.charAt(pos);
		if (ch !== "<") {
			let end = html.indexOf("<", pos);
			if (end === -1) end = html.length;
			const text = html.slice(pos, end);
			if (text) nodes.push(decodeEntities(text));
			pos = end;
			continue;
		}

		const closeMatch = html.slice(pos).match(/^<\/(\w+)>/);
		if (closeMatch) break;

		const openMatch = html.slice(pos).match(/^<(\w+)((?:\s+[^>]*?)?)(\/?)>/);
		if (!openMatch) {
			nodes.push(decodeEntities(ch));
			pos++;
			continue;
		}

		const matchTag = openMatch[1] ?? "";
		const matchAttrs = openMatch[2] ?? "";
		const matchSlash = openMatch[3] ?? "";
		const attrs = parseAttributes(matchAttrs);
		const isSelfClose = matchSlash === "/" || SELF_CLOSING_TAGS.has(matchTag);
		const Tag = matchTag as keyof React.JSX.IntrinsicElements;
		const afterOpen = pos + openMatch[0].length;

		if (isSelfClose) {
			nodes.push(<Tag key={_key++} {...attrs} />);
			pos = afterOpen;
			continue;
		}

		const closeIdx = findMatchingClose(html, afterOpen, matchTag);
		if (closeIdx === -1) {
			nodes.push(<Tag key={_key++} {...attrs} />);
			pos = afterOpen;
			continue;
		}

		const inner = html.slice(afterOpen, closeIdx);
		const childNodes = inner ? parseChildren(inner) : [];
		const content =
			childNodes.length === 1
				? childNodes[0]
				: childNodes.length > 0
					? childNodes
					: null;
		nodes.push(
			<Tag key={_key++} {...attrs}>
				{content}
			</Tag>,
		);
		pos = closeIdx + matchTag.length + 3;
	}

	return nodes;
}

function parseHtmlToJsx(html: string): React.ReactNode {
	_key = 0;
	const nodes = parseChildren(html);
	return nodes.length === 1 ? nodes[0] : nodes;
}

function renderMarkdown(text: string): React.ReactNode {
	const raw = marked.parse(text, { async: false }) as string;
	return parseHtmlToJsx(raw);
}

function buildCardNode(
	props: CardExportState,
	exportWidth: number,
): React.ReactNode {
	const {
		text,
		name,
		headline,
		photo,
		logo,
		logoOpacity = 0.5,
		logoPosition = "right",
		cardBgColor,
		cardTextColor,
		fontFamily,
		fontSize = 32,
		textAlign = "left",
		layoutPreset = "classic",
		accentColor = "#6366f1",
		bgType = "solid",
		bgGradient = "",
		emptyText = "Your quote will appear here",
	} = props;

	const scaleFactor = exportWidth / REFERENCE_WIDTH;
	const scaledFontSize = Math.round(fontSize * scaleFactor);

	const resolvedFont = resolveFontFamily(fontFamily);
	const bgStyle: React.CSSProperties =
		bgType === "gradient" && bgGradient
			? { backgroundImage: bgGradient }
			: { backgroundColor: cardBgColor };

	const logoPosClass = LOGO_POS_CLASS[logoPosition];

	const alignClass =
		textAlign === "center"
			? "card-text--center"
			: textAlign === "right"
				? "card-text--right"
				: "card-text--left";

	const textContent = text ? (
		<div
			className={`card-text ${alignClass}`}
			style={{
				color: cardTextColor,
				fontFamily: resolvedFont,
				fontSize: `${scaledFontSize}px`,
			}}
		>
			{renderMarkdown(text)}
		</div>
	) : (
		<div className={`card-text card-text--empty ${alignClass}`}>
			{emptyText}
		</div>
	);

	if (layoutPreset === "modern") {
		return (
			<div
				className="card-content layout-modern"
				style={{ color: cardTextColor, fontFamily: resolvedFont, ...bgStyle }}
			>
				<div
					className="card-accent-bar"
					style={{ backgroundColor: accentColor }}
				/>
				<div className="card-text-wrap">{textContent}</div>
				<footer className="card-footer">
					{photo && (
						<img src={photo} alt="" className="card-photo card-photo--sm" />
					)}
					<div>
						{name && <h2 className="card-name">{name}</h2>}
						{headline && <p className="card-headline">{headline}</p>}
					</div>
				</footer>
				{logo && (
					<img
						src={logo}
						alt=""
						className={`card-logo ${logoPosClass}`}
						style={{ opacity: logoOpacity }}
					/>
				)}
			</div>
		);
	}

	if (layoutPreset === "split") {
		return (
			<div
				className="card-content layout-split"
				style={{ color: cardTextColor, fontFamily: resolvedFont, ...bgStyle }}
			>
				<div className="card-split-inner">
					<div
						className="card-split-left"
						style={{ backgroundColor: accentColor }}
					>
						{photo && (
							<img src={photo} alt="" className="card-photo card-photo--xl" />
						)}
						{name && <h3 className="card-name card-split-name">{name}</h3>}
						{headline && (
							<p className="card-headline card-split-headline">{headline}</p>
						)}
					</div>
					<div className="card-split-right">
						{textContent}
						{logo && (
							<img
								src={logo}
								alt=""
								className={`card-logo card-logo--split ${logoPosClass}`}
								style={{ opacity: logoOpacity }}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}

	const showDq = layoutPreset === "bold-quote" || layoutPreset === "gradient";

	return (
		<div
			className={`card-content layout-${layoutPreset}`}
			style={{ color: cardTextColor, fontFamily: resolvedFont, ...bgStyle }}
		>
			{showDq && (
				<span
					className={`card-dq${layoutPreset === "gradient" ? " card-dq--gradient" : ""}`}
				>
					<svg
						viewBox="2.679 4.675 18.528 14.508"
						style={{ color: accentColor }}
					>
						<path
							fill="currentColor"
							d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"
						/>
					</svg>
				</span>
			)}

			{layoutPreset === "centered" && (
				<div className="card-centered-header">
					{photo && (
						<img src={photo} alt="" className="card-photo card-photo--xl" />
					)}
					{name && <h2 className="card-name">{name}</h2>}
					{headline && <p className="card-headline">{headline}</p>}
				</div>
			)}

			{layoutPreset !== "minimal" &&
				layoutPreset !== "centered" &&
				layoutPreset !== "gradient" && (
					<header className="card-header">
						{photo && <img src={photo} alt="" className="card-photo" />}
						<div className="card-identity">
							{name && <h2 className="card-name">{name}</h2>}
							{headline && <p className="card-headline">{headline}</p>}
						</div>
					</header>
				)}

			{textContent}

			{layoutPreset === "minimal" && name && (
				<p className="card-minimal-att" style={{ color: accentColor }}>
					{"\u2014"} {name}
				</p>
			)}

			{layoutPreset === "gradient" && (name || headline) && (
				<div className="card-gradient-bar">
					{name && <span className="card-gradient-name">{name}</span>}
					{headline && (
						<span className="card-gradient-headline">{headline}</span>
					)}
				</div>
			)}

			{layoutPreset !== "minimal" && layoutPreset !== "gradient" && logo && (
				<img
					src={logo}
					alt=""
					className={`card-logo ${logoPosClass}`}
					style={{ opacity: logoOpacity }}
				/>
			)}
		</div>
	);
}

export async function buildQuoteCard(props: CardExportState) {
	const dims = ASPECT_DIMENSIONS[props.aspectRatio] ?? {
		width: 1200,
		height: 630,
	};

	const families = buildFontFamilies(props.fontFamily);
	const loadedFonts =
		families.length > 0 ? await googleFonts({ families }) : [];

	const node = buildCardNode(props, dims.width);

	return {
		node,
		options: {
			width: dims.width,
			height: dims.height,
			fonts: loadedFonts,
			stylesheets: [getCardStylesheet(dims.width)],
		},
	};
}

"use client";

import DOMPurify from "dompurify";
import { marked } from "marked";
import { useTranslations } from "../i18n/use-translations";
import type { LogoPosition, QuoteState, TextAlign } from "../store/quote-store";

const RATIO_STYLE: Record<string, string> = {
	"1:1": "1 / 1",
	"4:5": "4 / 5",
	"1.91:1": "1.91 / 1",
	"9:16": "9 / 16",
};

export type CardProps = Pick<
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
>;

const ALIGN_CLASS: Record<TextAlign, string> = {
	left: "card-text--left",
	center: "card-text--center",
	right: "card-text--right",
};

const LOGO_POS_CLASS: Record<LogoPosition, string> = {
	left: "card-logo--left",
	center: "card-logo--center",
	right: "card-logo--right",
};

function renderMarkdown(text: string): string {
	const raw = marked.parse(text, { async: false }) as string;
	if (typeof window === "undefined") return raw;
	return DOMPurify.sanitize(raw);
}

export function QuoteCardContent({
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
	aspectRatio = "1.91:1",
	accentColor = "#6366f1",
	bgType = "solid",
	bgGradient = "",
}: CardProps) {
	const { t } = useTranslations();
	const alignClass = ALIGN_CLASS[textAlign];
	const logoPosClass = LOGO_POS_CLASS[logoPosition];
	const bgStyle: React.CSSProperties =
		bgType === "gradient" && bgGradient
			? { backgroundImage: bgGradient }
			: { backgroundColor: cardBgColor };

	return (
		<div
			className={`card-content layout-${layoutPreset}`}
			style={{
				aspectRatio: RATIO_STYLE[aspectRatio] ?? "1.91 / 1",
				color: cardTextColor,
				fontFamily,
				...bgStyle,
			}}
		>
			{/* ── Decorative quote marks ── */}
			{(layoutPreset === "bold-quote" || layoutPreset === "gradient") && (
				<span
					className={`card-dq${layoutPreset === "gradient" ? " card-dq--gradient" : ""}`}
					// style={{ color: accentColor }}
					aria-hidden="true"
				>
					<svg style={{ color: accentColor }}>
						<use href="images/quotes.svg#quotes" />
					</svg>
				</span>
			)}

			{/* ── Centered profile header ── */}
			{layoutPreset === "centered" && (
				<div className="card-centered-header">
					{photo && (
						<img src={photo} alt="" className="card-photo card-photo--xl" />
					)}
					{name && <h2 className="card-name">{name}</h2>}
					{headline && <p className="card-headline">{headline}</p>}
				</div>
			)}

			{/* ── Classic top-left header ── */}
			{layoutPreset !== "minimal" &&
				layoutPreset !== "modern" &&
				layoutPreset !== "centered" &&
				layoutPreset !== "split" &&
				layoutPreset !== "gradient" && (
					<header className="card-header">
						{photo && <img src={photo} alt="" className="card-photo" />}
						<div className="card-identity">
							{name && <h2 className="card-name">{name}</h2>}
							{headline && <p className="card-headline">{headline}</p>}
						</div>
					</header>
				)}

			{/* ── Modern accent bar ── */}
			{layoutPreset === "modern" && (
				<div
					className="card-accent-bar"
					style={{ backgroundColor: accentColor }}
				/>
			)}

			{/* ── Modern text wrap ── */}
			{layoutPreset === "modern" && (
				<div className="card-text-wrap">
					{text ? (
						<div
							className={`card-text ${alignClass}`}
							style={{
								color: cardTextColor,
								fontFamily,
								fontSize: `${fontSize}px`,
							}}
							dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
						/>
					) : (
						<div className={`card-text card-text--empty ${alignClass}`}>
							<p>{t("quoteCard.empty")}</p>
						</div>
					)}
				</div>
			)}

			{/* ── Split layout: left panel ── */}
			{layoutPreset === "split" && (
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
						{text ? (
							<div
								className={`card-text ${alignClass}`}
								style={{
									color: cardTextColor,
									fontFamily,
									fontSize: `${fontSize}px`,
								}}
								dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
							/>
						) : (
							<div className={`card-text card-text--empty ${alignClass}`}>
								<p>{t("quoteCard.empty")}</p>
							</div>
						)}
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
			)}

			{/* ── Direct text (classic, bold-quote, centered, gradient, minimal) ── */}
			{layoutPreset !== "modern" &&
				layoutPreset !== "split" &&
				(text ? (
					<div
						className={`card-text ${alignClass}`}
						style={{
							color: cardTextColor,
							fontFamily,
							fontSize: `${fontSize}px`,
						}}
						dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
					/>
				) : (
					<div className={`card-text card-text--empty ${alignClass}`}>
						<p>{t("quoteCard.empty")}</p>
					</div>
				))}

			{/* ── Modern footer ── */}
			{layoutPreset === "modern" && (
				<footer className="card-footer">
					{photo && (
						<img src={photo} alt="" className="card-photo card-photo--sm" />
					)}
					<div>
						{name && <h2 className="card-name">{name}</h2>}
						{headline && <p className="card-headline">{headline}</p>}
					</div>
				</footer>
			)}

			{/* ── Minimal attribution ── */}
			{layoutPreset === "minimal" && name && (
				<p className="card-minimal-att" style={{ color: accentColor }}>
					&mdash; {name}
				</p>
			)}

			{/* ── Gradient bottom bar ── */}
			{layoutPreset === "gradient" && (name || headline) && (
				<div className="card-gradient-bar">
					{name && <span className="card-gradient-name">{name}</span>}
					{headline && (
						<span className="card-gradient-headline">{headline}</span>
					)}
				</div>
			)}

			{/* ── Logo (excluded from layouts that have their own) ── */}
			{layoutPreset !== "minimal" &&
				layoutPreset !== "split" &&
				layoutPreset !== "gradient" &&
				logo && (
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

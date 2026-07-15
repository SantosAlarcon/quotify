"use client";

import { type ChangeEvent, useId, useRef, useState } from "react";
import { useTranslations } from "../i18n/use-translations";
import { FONT_OPTIONS } from "../lib/fonts";
import type {
	AspectRatio,
	BgType,
	LayoutPreset,
	LogoPosition,
	TextAlign,
} from "../store/quote-store";
import { useQuoteStore } from "../store/quote-store";
import { ImageUpload } from "./image-upload";
import { TemplateGallery } from "./template-gallery";

const MAX_FONT_SIZE = 2 * 1024 * 1024;

const LAYOUTS: { value: LayoutPreset; labelKey: string }[] = [
	{ value: "classic", labelKey: "editor.layoutLabels.classic" },
	{ value: "modern", labelKey: "editor.layoutLabels.modern" },
	{ value: "bold-quote", labelKey: "editor.layoutLabels.boldQuote" },
	{ value: "minimal", labelKey: "editor.layoutLabels.minimal" },
	{ value: "centered", labelKey: "editor.layoutLabels.centered" },
	{ value: "split", labelKey: "editor.layoutLabels.split" },
	{ value: "gradient", labelKey: "editor.layoutLabels.gradient" },
];

const RATIOS: { value: AspectRatio; labelKey: string; dims: string }[] = [
	{
		value: "1:1",
		labelKey: "editor.aspectRatioLabels.square",
		dims: "1080×1080",
	},
	{
		value: "4:5",
		labelKey: "editor.aspectRatioLabels.portrait",
		dims: "1080×1350",
	},
	{
		value: "1.91:1",
		labelKey: "editor.aspectRatioLabels.og",
		dims: "1200×630",
	},
	{
		value: "9:16",
		labelKey: "editor.aspectRatioLabels.story",
		dims: "1080×1920",
	},
];

const ALIGNMENTS: { value: TextAlign; labelKey: string }[] = [
	{ value: "left", labelKey: "editor.alignmentLabels.left" },
	{ value: "center", labelKey: "editor.alignmentLabels.center" },
	{ value: "right", labelKey: "editor.alignmentLabels.right" },
];

const GRADIENT_PRESETS: { labelKey: string; value: string }[] = [
	{ labelKey: "editor.gradientLabels.none", value: "" },
	{
		labelKey: "editor.gradientLabels.sunset",
		value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
	},
	{
		labelKey: "editor.gradientLabels.ocean",
		value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
	},
	{
		labelKey: "editor.gradientLabels.forest",
		value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
	},
	{
		labelKey: "editor.gradientLabels.night",
		value: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
	},
	{
		labelKey: "editor.gradientLabels.peach",
		value: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
	},
	{
		labelKey: "editor.gradientLabels.lavender",
		value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
	},
	{
		labelKey: "editor.gradientLabels.mojave",
		value: "linear-gradient(135deg, #f77062 0%, #fe5196 100%)",
	},
	{
		labelKey: "editor.gradientLabels.aurora",
		value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
	},
	{
		labelKey: "editor.gradientLabels.crimson",
		value: "linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)",
	},
	{
		labelKey: "editor.gradientLabels.mint",
		value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
	},
	{
		labelKey: "editor.gradientLabels.golden",
		value: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)",
	},
	{
		labelKey: "editor.gradientLabels.sky",
		value: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
	},
	{
		labelKey: "editor.gradientLabels.rose",
		value: "linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)",
	},
	{
		labelKey: "editor.gradientLabels.emerald",
		value: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
	},
	{
		labelKey: "editor.gradientLabels.twilight",
		value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
	},
];

const CATEGORY_KEYS: Record<string, string> = {
	serif: "editor.fontCategories.serif",
	"sans-serif": "editor.fontCategories.sansSerif",
	monospace: "editor.fontCategories.monospace",
};

const CATEGORY_ORDER: string[] = ["serif", "sans-serif", "monospace"];

export function Editor() {
	const {
		text,
		setName,
		setHeadline,
		setPhoto,
		setLogo,
		setLogoOpacity,
		setLogoPosition,
		setCardBgColor,
		setCardTextColor,
		setFontFamily,
		setText,
		setLayoutPreset,
		setAspectRatio,
		setAccentColor,
		setFontSize,
		setTextAlign,
		setBgType,
		setBgGradient,
		name,
		headline,
		photo,
		logo,
		logoOpacity,
		logoPosition,
		cardBgColor,
		cardTextColor,
		fontFamily,
		fontSize,
		textAlign,
		layoutPreset,
		aspectRatio,
		accentColor,
		customFont,
		setCustomFont,
		bgType,
		bgGradient,
		reset,
	} = useQuoteStore();
	const { t } = useTranslations();

	const uploadRef = useRef<HTMLInputElement>(null);
	const configRef = useRef<HTMLInputElement>(null);
	const uploadId = useId();

	const [toast, setToast] = useState<string | null>(null);

	const showToast = (msg: string) => {
		setToast(msg);
		setTimeout(() => setToast(null), 2500);
	};

	const handleFontUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > MAX_FONT_SIZE) {
			showToast(t("editor.toasts.fontTooLarge"));
			return;
		}

		const name = file.name.replace(/\.[^/.]+$/, "");

		const reader = new FileReader();
		reader.onload = () => {
			setCustomFont({ name, dataUrl: reader.result as string });
			setFontFamily(name);
			showToast(t("editor.toasts.fontLoaded", { name }));
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveFont = () => {
		setCustomFont(null);
		setFontFamily("Georgia, serif");
		if (uploadRef.current) uploadRef.current.value = "";
	};

	const handleExport = () => {
		const config = {
			name,
			headline,
			photo,
			logo,
			logoOpacity,
			logoPosition,
			cardBgColor,
			cardTextColor,
			fontFamily,
			fontSize,
			textAlign,
			text,
			layoutPreset,
			aspectRatio,
			accentColor,
			bgType,
			bgGradient,
		};
		const blob = new Blob([JSON.stringify(config, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "quotify-config.json";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		showToast(t("editor.toasts.configExported"));
	};

	const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			try {
				const data = JSON.parse(reader.result as string);
				if (typeof data !== "object" || data === null) return;

				if (typeof data.name === "string") setName(data.name);
				if (typeof data.headline === "string") setHeadline(data.headline);
				if (typeof data.photo === "string" || data.photo === null)
					setPhoto(data.photo);
				if (typeof data.logo === "string" || data.logo === null)
					setLogo(data.logo);
				if (typeof data.logoOpacity === "number")
					setLogoOpacity(data.logoOpacity);
				if (["left", "center", "right"].includes(data.logoPosition))
					setLogoPosition(data.logoPosition);
				if (typeof data.cardBgColor === "string")
					setCardBgColor(data.cardBgColor);
				if (typeof data.cardTextColor === "string")
					setCardTextColor(data.cardTextColor);
				if (typeof data.fontFamily === "string") setFontFamily(data.fontFamily);
				if (typeof data.fontSize === "number") setFontSize(data.fontSize);
				if (["left", "center", "right"].includes(data.textAlign))
					setTextAlign(data.textAlign);
				if (typeof data.text === "string") setText(data.text);
				if (
					["classic", "modern", "bold-quote", "minimal"].includes(
						data.layoutPreset,
					)
				)
					setLayoutPreset(data.layoutPreset);
				if (["1:1", "4:5", "1.91:1", "9:16"].includes(data.aspectRatio))
					setAspectRatio(data.aspectRatio);
				if (typeof data.accentColor === "string")
					setAccentColor(data.accentColor);
				if (["solid", "gradient"].includes(data.bgType)) setBgType(data.bgType);
				if (typeof data.bgGradient === "string") setBgGradient(data.bgGradient);
				showToast(t("editor.toasts.configImported"));
			} catch {
				showToast(t("editor.toasts.invalidConfig"));
			}
		};
		reader.readAsText(file);
		if (configRef.current) configRef.current.value = "";
	};

	const handleReset = () => {
		if (window.confirm(t("editor.dialogs.resetConfirm"))) {
			reset();
			showToast(t("editor.toasts.settingsReset"));
		}
	};

	const categories = CATEGORY_ORDER.filter((c) =>
		FONT_OPTIONS.some((f) => f.category === c),
	);

	return (
		<>
			<h1 className="editor-panel__title">{t("home.title")}</h1>
			<form className="editor" onSubmit={(e) => e.preventDefault()}>
				<section className="editor__section">
					<h2>{t("editor.sections.templates")}</h2>
					<TemplateGallery />
				</section>

				<section className="editor__section">
					<h2>{t("editor.sections.layout")}</h2>
					<div className="preset-grid">
						{LAYOUTS.map((l) => (
							<button
								key={l.value}
								type="button"
								className={`preset-btn layout-${l.value}${layoutPreset === l.value ? " preset-btn--active" : ""}`}
								onClick={() => setLayoutPreset(l.value)}
								aria-pressed={layoutPreset === l.value}
								style={
									layoutPreset === l.value
										? { borderColor: accentColor }
										: undefined
								}
							>
								<span className="preset-btn__preview" />
								<span className="preset-btn__label">{t(l.labelKey)}</span>
							</button>
						))}
					</div>
				</section>

				<section className="editor__section">
					<h2>{t("editor.sections.aspectRatio")}</h2>
					<div className="ratio-grid">
						{RATIOS.map((r) => (
							<button
								key={r.value}
								type="button"
								className={`ratio-btn${aspectRatio === r.value ? " ratio-btn--active" : ""}`}
								onClick={() => setAspectRatio(r.value)}
								aria-pressed={aspectRatio === r.value}
								style={
									aspectRatio === r.value
										? { borderColor: accentColor }
										: undefined
								}
							>
								<span
									className={`ratio-btn__thumb ratio-btn__thumb--${r.value === "1.91:1" ? "1-91-1" : r.value.replace(":", "-")}`}
								/>
								<span className="ratio-btn__label">
									{t(r.labelKey)}
									<small className="ratio-btn__dims">{r.dims}</small>
								</span>
							</button>
						))}
					</div>
				</section>

				<section className="editor__section">
					<h2>{t("editor.sections.quote")}</h2>
					<label>
						<span>
							{t("editor.labels.quoteText")}{" "}
							<small title="**bold**, *italic*, `code`, [links](url), lists, blockquotes">
								{t("editor.labels.markdownSupported")}
							</small>
						</span>
						<textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							rows={4}
							placeholder={t("editor.labels.quotePlaceholder")}
						/>
					</label>
					<div>
						<span className="editor__label">
							{t("editor.labels.textAlignment")}
						</span>
						<div className="align-grid">
							{ALIGNMENTS.map((a) => (
								<button
									key={a.value}
									type="button"
									className={`align-btn${textAlign === a.value ? " align-btn--active" : ""}`}
									onClick={() => setTextAlign(a.value)}
									aria-pressed={textAlign === a.value}
								>
									{t(a.labelKey)}
								</button>
							))}
						</div>
					</div>
				</section>

				<section className="editor__section">
					<h2>{t("editor.sections.profile")}</h2>
					<label>
						<span>{t("editor.labels.name")}</span>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder={t("editor.labels.namePlaceholder")}
						/>
					</label>
					<label>
						<span>{t("editor.labels.headline")}</span>
						<input
							type="text"
							value={headline}
							onChange={(e) => setHeadline(e.target.value)}
							placeholder={t("editor.labels.headlinePlaceholder")}
						/>
					</label>
					<ImageUpload
						label={t("editor.labels.photo")}
						currentImage={photo}
						onImageChange={setPhoto}
					/>
				</section>

				<section className="editor__section">
					<h2>{t("editor.sections.branding")}</h2>
					<ImageUpload
						label={t("editor.labels.logo")}
						currentImage={logo}
						onImageChange={setLogo}
					/>
					{logo && (
						<>
							<label>
								<span>
									{t("editor.labels.logoOpacity", {
										n: Math.round(logoOpacity * 100),
									})}
								</span>
								<input
									type="range"
									min="0.1"
									max="1"
									step="0.05"
									value={logoOpacity}
									onChange={(e) => setLogoOpacity(Number(e.target.value))}
								/>
							</label>
							<div>
								<span className="editor__label">
									{t("editor.labels.logoPosition")}
								</span>
								<div className="align-grid">
									{(["left", "center", "right"] as LogoPosition[]).map((p) => (
										<button
											key={p}
											type="button"
											className={`align-btn${logoPosition === p ? " align-btn--active" : ""}`}
											onClick={() => setLogoPosition(p)}
											aria-pressed={logoPosition === p}
										>
											{t(`editor.alignmentLabels.${p}`)}
										</button>
									))}
								</div>
							</div>
						</>
					)}
					<label>
						<span>{t("editor.labels.accentColor")}</span>
						<input
							type="color"
							value={accentColor}
							onChange={(e) => setAccentColor(e.target.value)}
						/>
					</label>
					<label>
						<span>{t("editor.labels.backgroundColor")}</span>
						<input
							type="color"
							value={cardBgColor}
							onChange={(e) => setCardBgColor(e.target.value)}
						/>
					</label>
					<label>
						<span>{t("editor.labels.backgroundType")}</span>
						<select
							value={bgType}
							onChange={(e) => setBgType(e.target.value as BgType)}
						>
							<option value="solid">{t("editor.labels.solidColor")}</option>
							<option value="gradient">{t("editor.labels.gradient")}</option>
						</select>
					</label>
					{bgType === "gradient" && (
						<div>
							<span className="editor__label">
								{t("editor.labels.gradientPreset")}
							</span>
							<div className="gradient-grid">
								{GRADIENT_PRESETS.map((g) => (
									<button
										key={g.value}
										type="button"
										className={`gradient-btn${bgGradient === g.value ? " gradient-btn--active" : ""}`}
										onClick={() => setBgGradient(g.value)}
										aria-pressed={bgGradient === g.value}
										title={t(g.labelKey)}
									>
										<span
											className="gradient-btn__swatch"
											style={{
												background: g.value || cardBgColor,
											}}
										/>
										<span className="gradient-btn__label">{t(g.labelKey)}</span>
									</button>
								))}
							</div>
						</div>
					)}
					<label>
						<span>{t("editor.labels.textColor")}</span>
						<input
							type="color"
							value={cardTextColor}
							onChange={(e) => setCardTextColor(e.target.value)}
						/>
					</label>
				</section>

				<section className="editor__section">
					<h2>{t("editor.sections.typography")}</h2>
					<label>
						<span>{t("editor.labels.font")}</span>
						<select
							value={fontFamily}
							onChange={(e) => setFontFamily(e.target.value)}
						>
							{categories.map((cat) => (
								<optgroup key={cat} label={t(CATEGORY_KEYS[cat] ?? cat)}>
									{FONT_OPTIONS.filter((f) => f.category === cat).map((f) => (
										<option
											key={f.id}
											value={f.fontFamily}
											style={{ fontFamily: f.fontFamily }}
										>
											{f.label}
										</option>
									))}
								</optgroup>
							))}
							{customFont && (
								<optgroup label={t("editor.fontCategories.custom")}>
									<option value={customFont.name}>{customFont.name}</option>
								</optgroup>
							)}
						</select>
					</label>
					<label>
						<span>{t("editor.labels.fontSize", { n: fontSize })}</span>
						<input
							type="range"
							min="14"
							max="72"
							value={fontSize}
							onChange={(e) => setFontSize(Number(e.target.value))}
							className="font-size-slider"
						/>
					</label>
					<div className="font-upload">
						<input
							ref={uploadRef}
							type="file"
							accept=".woff2,.woff,.ttf,.otf"
							onChange={handleFontUpload}
							id={uploadId}
							className="visually-hidden"
						/>
						<label htmlFor={uploadId} className="font-upload__trigger">
							{t("editor.labels.uploadCustomFont")}
						</label>
						{customFont && (
							<button
								type="button"
								className="font-upload__remove"
								onClick={handleRemoveFont}
							>
								{t("editor.labels.removeCustomFont", {
									fontName: customFont.name,
								})}
							</button>
						)}
					</div>
				</section>

				<section className="editor__section editor__section--reset">
					<button type="button" className="reset-btn" onClick={handleReset}>
						{t("editor.buttons.resetAll")}
					</button>
				</section>

				<section className="editor__section">
					<h2>{t("editor.sections.importExport")}</h2>
					<div className="config-actions">
						<button
							type="button"
							className="config-btn"
							aria-label={t("editor.buttons.exportConfig")}
							onClick={handleExport}
						>
							{t("editor.buttons.exportConfig")}
						</button>
						<button
							type="button"
							aria-label={t("editor.buttons.importConfig")}
							className="config-btn"
							onClick={() => configRef.current?.click()}
						>
							{t("editor.buttons.importConfig")}
						</button>
						<input
							aria-label={t("editor.buttons.importConfig")}
							ref={configRef}
							type="file"
							accept=".json"
							onChange={handleImport}
							className="visually-hidden"
						/>
					</div>
				</section>

				{toast && (
					<div className="editor-toast" role="status" aria-live="polite">
						{toast}
					</div>
				)}
			</form>
		</>
	);
}

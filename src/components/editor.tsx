"use client";

import { useRef, useState, useId, type ChangeEvent } from "react";
import type { AspectRatio, LayoutPreset, TextAlign, BgType, LogoPosition } from "../store/quote-store";
import { useQuoteStore } from "../store/quote-store";
import { FONT_OPTIONS } from "../lib/fonts";
import { ImageUpload } from "./image-upload";

const MAX_FONT_SIZE = 2 * 1024 * 1024;

const LAYOUTS: { value: LayoutPreset; label: string }[] = [
	{ value: "classic", label: "Classic" },
	{ value: "modern", label: "Modern" },
	{ value: "bold-quote", label: "Bold Quote" },
	{ value: "minimal", label: "Minimal" },
];

const RATIOS: { value: AspectRatio; label: string; dims: string }[] = [
	{ value: "1:1", label: "Square", dims: "1080×1080" },
	{ value: "4:5", label: "Portrait", dims: "1080×1350" },
	{ value: "1.91:1", label: "OG", dims: "1200×630" },
	{ value: "9:16", label: "Story", dims: "1080×1920" },
];

const ALIGNMENTS: { value: TextAlign; label: string }[] = [
	{ value: "left", label: "Left" },
	{ value: "center", label: "Center" },
	{ value: "right", label: "Right" },
];

const GRADIENT_PRESETS: { label: string; value: string }[] = [
	{ label: "None", value: "" },
	{ label: "Sunset", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
	{ label: "Ocean", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
	{ label: "Forest", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
	{ label: "Night", value: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)" },
	{ label: "Peach", value: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)" },
	{ label: "Lavender", value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
	{ label: "Mojave", value: "linear-gradient(135deg, #f77062 0%, #fe5196 100%)" },
];

const CATEGORY_LABELS: Record<string, string> = {
	serif: "Serif",
	"sans-serif": "Sans Serif",
	monospace: "Monospace",
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
			showToast("Font file is too large (max 2 MB).");
			return;
		}

		const name = file.name.replace(/\.[^/.]+$/, "");

		const reader = new FileReader();
		reader.onload = () => {
			setCustomFont({ name, dataUrl: reader.result as string });
			setFontFamily(name);
			showToast(`Font "${name}" loaded`);
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
		const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "quotify-config.json";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		showToast("Config exported");
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
				if (typeof data.photo === "string" || data.photo === null) setPhoto(data.photo);
				if (typeof data.logo === "string" || data.logo === null) setLogo(data.logo);
				if (typeof data.logoOpacity === "number") setLogoOpacity(data.logoOpacity);
				if (["left", "center", "right"].includes(data.logoPosition)) setLogoPosition(data.logoPosition);
				if (typeof data.cardBgColor === "string") setCardBgColor(data.cardBgColor);
				if (typeof data.cardTextColor === "string") setCardTextColor(data.cardTextColor);
				if (typeof data.fontFamily === "string") setFontFamily(data.fontFamily);
				if (typeof data.fontSize === "number") setFontSize(data.fontSize);
				if (["left", "center", "right"].includes(data.textAlign)) setTextAlign(data.textAlign);
				if (typeof data.text === "string") setText(data.text);
				if (["classic", "modern", "bold-quote", "minimal"].includes(data.layoutPreset)) setLayoutPreset(data.layoutPreset);
				if (["1:1", "4:5", "1.91:1", "9:16"].includes(data.aspectRatio)) setAspectRatio(data.aspectRatio);
				if (typeof data.accentColor === "string") setAccentColor(data.accentColor);
				if (["solid", "gradient"].includes(data.bgType)) setBgType(data.bgType);
				if (typeof data.bgGradient === "string") setBgGradient(data.bgGradient);
				showToast("Config imported successfully");
			} catch {
				showToast("Invalid config file");
			}
		};
		reader.readAsText(file);
		if (configRef.current) configRef.current.value = "";
	};

	const handleReset = () => {
		if (window.confirm("Are you sure you want to reset all settings?")) {
			reset();
			showToast("Settings reset");
		}
	};

	const categories = CATEGORY_ORDER.filter(c => FONT_OPTIONS.some(f => f.category === c));

	return (
		<form className="editor" onSubmit={(e) => e.preventDefault()}>
			<section className="editor__section">
				<h2>Layout</h2>
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
							<span className="preset-btn__label">{l.label}</span>
						</button>
					))}
				</div>
			</section>

			<section className="editor__section">
				<h2>Aspect Ratio</h2>
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
								className={`ratio-btn__thumb ratio-btn__thumb--${r.value.replace(":", "-")}`}
							/>
							<span className="ratio-btn__label">
								{r.label}
								<small className="ratio-btn__dims">{r.dims}</small>
							</span>
						</button>
					))}
				</div>
			</section>

			<section className="editor__section">
				<h2>Quote</h2>
				<label>
					<span>
						Quote text <small title="**bold**, *italic*, `code`, [links](url), lists, blockquotes">(Markdown supported)</small>
					</span>
					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows={4}
						placeholder="Enter your quote... **bold**, *italic*, [links](url)"
					/>
				</label>
				<div>
					<span className="editor__label">Text alignment</span>
					<div className="align-grid">
						{ALIGNMENTS.map((a) => (
							<button
								key={a.value}
								type="button"
								className={`align-btn${textAlign === a.value ? " align-btn--active" : ""}`}
								onClick={() => setTextAlign(a.value)}
								aria-pressed={textAlign === a.value}
							>
								{a.label}
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="editor__section">
				<h2>Profile</h2>
				<label>
					<span>Name</span>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Your name"
					/>
				</label>
				<label>
					<span>Headline</span>
					<input
						type="text"
						value={headline}
						onChange={(e) => setHeadline(e.target.value)}
						placeholder="Your title or tagline"
					/>
				</label>
				<ImageUpload
					label="Photo"
					currentImage={photo}
					onImageChange={setPhoto}
				/>
			</section>

			<section className="editor__section">
				<h2>Branding</h2>
				<ImageUpload label="Logo" currentImage={logo} onImageChange={setLogo} />
				{logo && (
					<>
						<label>
							<span>Logo opacity: {Math.round(logoOpacity * 100)}%</span>
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
							<span className="editor__label">Logo position</span>
							<div className="align-grid">
								{(["left", "center", "right"] as LogoPosition[]).map((p) => (
									<button
										key={p}
										type="button"
										className={`align-btn${logoPosition === p ? " align-btn--active" : ""}`}
										onClick={() => setLogoPosition(p)}
										aria-pressed={logoPosition === p}
									>
										{p.charAt(0).toUpperCase() + p.slice(1)}
									</button>
								))}
							</div>
						</div>
					</>
				)}
				<label>
					<span>Accent color</span>
					<input
						type="color"
						value={accentColor}
						onChange={(e) => setAccentColor(e.target.value)}
					/>
				</label>
				<label>
					<span>Background color</span>
					<input
						type="color"
						value={cardBgColor}
						onChange={(e) => setCardBgColor(e.target.value)}
					/>
				</label>
				<label>
					<span>Background type</span>
					<select
						value={bgType}
						onChange={(e) => setBgType(e.target.value as BgType)}
					>
						<option value="solid">Solid color</option>
						<option value="gradient">Gradient</option>
					</select>
				</label>
				{bgType === "gradient" && (
					<div>
						<span className="editor__label">Gradient preset</span>
						<div className="gradient-grid">
							{GRADIENT_PRESETS.map((g) => (
								<button
									key={g.value}
									type="button"
									className={`gradient-btn${bgGradient === g.value ? " gradient-btn--active" : ""}`}
									onClick={() => setBgGradient(g.value)}
									aria-pressed={bgGradient === g.value}
									title={g.label}
								>
									<span
										className="gradient-btn__swatch"
										style={{
											background: g.value || cardBgColor,
										}}
									/>
									<span className="gradient-btn__label">{g.label}</span>
								</button>
							))}
						</div>
					</div>
				)}
				<label>
					<span>Text color</span>
					<input
						type="color"
						value={cardTextColor}
						onChange={(e) => setCardTextColor(e.target.value)}
					/>
				</label>
			</section>

			<section className="editor__section">
				<h2>Typography</h2>
				<label>
					<span>Font</span>
					<select
						value={fontFamily}
						onChange={(e) => setFontFamily(e.target.value)}
					>
						{categories.map((cat) => (
							<optgroup key={cat} label={CATEGORY_LABELS[cat] ?? cat}>
								{FONT_OPTIONS.filter((f) => f.category === cat).map((f) => (
									<option key={f.id} value={f.fontFamily} style={{ fontFamily: f.fontFamily }}>
										{f.label}
									</option>
								))}
							</optgroup>
						))}
						{customFont && (
							<optgroup label="Custom">
								<option value={customFont.name}>{customFont.name}</option>
							</optgroup>
						)}
					</select>
				</label>
				<label>
					<span>Font size: {fontSize}px</span>
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
						+ Upload custom font
					</label>
					{customFont && (
						<button
							type="button"
							className="font-upload__remove"
							onClick={handleRemoveFont}
						>
							Remove {customFont.name}
						</button>
					)}
				</div>
			</section>

			<section className="editor__section editor__section--reset">
				<button
					type="button"
					className="reset-btn"
					onClick={handleReset}
				>
					Reset all
				</button>
			</section>

			<section className="editor__section">
				<h2>Import / Export</h2>
				<div className="config-actions">
					<button
						type="button"
						className="config-btn"
						aria-label="Export config"
						onClick={handleExport}
					>
						Export config
					</button>
					<button
						type="button"
						aria-label="Import config"
						className="config-btn config-btn--import"
						onClick={() => configRef.current?.click()}
					>
						Import config
					</button>
					<input
						aria-label="Import config file"
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
	);
}

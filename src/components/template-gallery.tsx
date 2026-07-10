"use client";

import { TEMPLATES } from "../lib/templates";
import type { Template } from "../lib/templates";
import { useQuoteStore } from "../store/quote-store";
import { useTranslations } from "../i18n/use-translations";

export function TemplateGallery() {
	const { t } = useTranslations();
	const loadTemplate = useQuoteStore((s) => s.loadTemplate);

	const handleSelect = (template: Template) => {
		loadTemplate(template.config);
	};

	return (
		<div className="template-gallery">
			{TEMPLATES.map((tmpl) => (
				<button
					key={tmpl.id}
					type="button"
					className="template-card"
					onClick={() => handleSelect(tmpl)}
					aria-label={t(tmpl.nameKey)}
					title={t(tmpl.descriptionKey)}
				>
					<div
						className="template-card__swatch"
						style={{
							"--tmpl-accent": tmpl.config.accentColor,
							"--tmpl-bg": tmpl.config.cardBgColor,
							"--tmpl-text": tmpl.config.cardTextColor,
						} as React.CSSProperties}
					>
						<span className="template-card__layout-indicator">
							{AspectRatioIcon[tmpl.config.aspectRatio]}
						</span>
						<span className="template-card__font-preview" style={{ fontFamily: tmpl.config.fontFamily }}>
							Aa
						</span>
					</div>
					<span className="template-card__name">{t(tmpl.nameKey)}</span>
				</button>
			))}
		</div>
	);
}

const AspectRatioIcon: Record<string, string> = {
	"1:1": "▢",
	"4:5": "▯",
	"1.91:1": "▭",
	"9:16": "▮",
};

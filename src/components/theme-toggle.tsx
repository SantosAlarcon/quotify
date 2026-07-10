"use client";

import type { ThemeMode } from "../store/theme-store";
import { useThemeStore } from "../store/theme-store";
import { useTranslations } from "../i18n/use-translations";

const OPTIONS: { value: ThemeMode; labelKey: string; icon: string }[] = [
	{ value: "light", labelKey: "theme.light", icon: "☀️" },
	{ value: "dark", labelKey: "theme.dark", icon: "🌙" },
	{ value: "system", labelKey: "theme.system", icon: "💻" },
];

export function ThemeToggle() {
	const mode = useThemeStore((s) => s.mode);
	const setMode = useThemeStore((s) => s.setMode);
	const { t } = useTranslations();

	return (
		<div className="theme-toggle" role="radiogroup" aria-label={t("theme.label")}>
			{OPTIONS.map((opt) => (
				<button
					key={opt.value}
					type="button"
					role="radio"
					aria-checked={mode === opt.value}
					aria-label={t(opt.labelKey)}
					className={`theme-toggle__btn${mode === opt.value ? " theme-toggle__btn--active" : ""}`}
					onClick={() => setMode(opt.value)}
					title={t(opt.labelKey)}
				>
					<span aria-hidden="true">{opt.icon}</span>
				</button>
			))}
		</div>
	);
}

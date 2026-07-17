"use client";

import { useCallback } from "react";
import { useI18nStore } from "../store/i18n-store";
import ca from "./locales/ca.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import pt from "./locales/pt.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";

type TranslationMap = Record<string, unknown>;

const translations: Record<string, TranslationMap> = {
	en,
	es,
	ca,
	fr,
	pt,
	de,
	ja,
	it,
	ko,
	"zh-CN": zhCN,
	"zh-TW": zhTW,
};

function resolveKey(obj: TranslationMap, key: string): string | undefined {
	const parts = key.split(".");
	let current: unknown = obj;
	for (const part of parts) {
		if (current == null || typeof current !== "object") return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === "string" ? current : undefined;
}

function interpolate(
	str: string,
	params?: Record<string, string | number>,
): string {
	if (!params) return str;
	return str.replace(/\{(\w+)\}/g, (_, key: string) =>
		String(params[key] ?? `{${key}}`),
	);
}

export function useTranslations() {
	const locale = useI18nStore((s) => s.locale);

	const t = useCallback((key: string, params?: Record<string, string | number>): string => {
		const localeData: TranslationMap =
			translations[locale] ?? translations["en"]!;
		const enData: TranslationMap = translations["en"]!;

		let value = resolveKey(localeData, key);
		if (value === undefined) {
			value = resolveKey(enData, key);
		}
		if (value === undefined) return key;

		return interpolate(value, params);
	}, [locale]);

	return { t, locale };
}

"use client";

import { useTranslations } from "../i18n/use-translations";

export function Description() {
	const { t } = useTranslations();

	return <meta name="description" content={t("layout.description")} />;
}

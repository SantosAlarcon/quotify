"use client";

import { useEffect } from "react";
import { useTranslations } from "../i18n/use-translations";

export function PageTitle() {
	const { t } = useTranslations();

	useEffect(() => {
		document.title = t("layout.title");
	}, [t]);

	return null;
}
